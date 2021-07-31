import { FindConditions, getRepository, Like } from 'typeorm'
import fs from 'fs'

import ForbiddenError from '../exceptions/ForbiddenError'
import NotFoundError from '../exceptions/NotFoundError'
import Occurrence from '../models/Occurrence'
import OccurrenceHistory from '../models/OccurrenceHistory'
import OccurrenceInternalComment from '../models/OccurrenceInternalComment'
import OccurrenceViolator from '../models/OccurrenceViolator'
import { crateOccurrenceRequest } from '../types/occurrence/crateOccurrenceRequest'
import { createOccurrenceInternalComment } from '../types/occurrence/createOccurrenceInternalComment'
import { listEmployeeOccurrenceResponse } from '../types/occurrence/listEmployeeOccurrenceResponse'
import { listOccurrencesCitizenResponse } from '../types/occurrence/listOccurrencesCitizenResponse'
import { updateOccurrenceRequest } from '../types/occurrence/updateOccurrenceRequest'
import { getOccurrenceCitizenResponse } from '../types/occurrence/getOccurrenceCitizenResponse'
import { pagination } from '../types/pagination'
import { getCitizenFromId } from './CitizenService'
import { getEmployeeById } from './EmployeeService'
import {
    getOccurrenceEmployeeByIdResponse,
    getOccurrenceEmployeeResponse,
} from '../types/occurrence/getOccurrenceEmployeeResponse'
import { createOccurrenceResponse } from '../types/occurrence/createOccurrenceResponse'
import { uploadedFile } from '../types/uploadedFile'
import BadRequestError from '../exceptions/BadRequestError'
import uuid from '../utils/uuid'
import OccurrencePhoto from '../models/OccurrencePhoto'
import { getCountOccurrencesCitizenResponse } from '../types/occurrence/getCountOccurrencesCitizenResponse'

const getOccurrenceById = async (occurrenceId: string): Promise<Occurrence> => {
    const repository = getRepository(Occurrence)

    const occurrence = await repository.findOne(occurrenceId, {
        relations: [
            'citizen',
            'histories',
            'photos',
            'internalComments',
            'internalComments.employee',
            'violator',
        ],
    })

    if (occurrence === undefined) {
        throw new NotFoundError('Occurrence not found')
    }

    return occurrence
}

const createOccurrence = async (
    citizenId: string,
    entity: crateOccurrenceRequest
): Promise<createOccurrenceResponse> => {
    const repository = getRepository(Occurrence)

    const occurrence = new Occurrence()
    occurrence.category = entity.category
    occurrence.status = 'SolicitacaoCriada'
    occurrence.description = entity.description
    occurrence.address = entity.address
    occurrence.number = entity.number
    occurrence.district = entity.district
    occurrence.reference = entity.reference
    occurrence.latitude = entity.latitude
    occurrence.longitude = entity.longitude
    occurrence.occurrenceDate = entity.occurrenceDate
    occurrence.citizen = await getCitizenFromId(citizenId)

    await repository.save(occurrence)

    if (
        entity.violatorName !== undefined ||
        entity.violatorVehicle !== undefined ||
        entity.violatorAddress !== undefined ||
        entity.violatorOtherInformation !== undefined
    ) {
        const repositoryViolator = getRepository(OccurrenceViolator)

        const violator = new OccurrenceViolator()
        violator.name = entity.violatorName
        violator.vehicle = entity.violatorVehicle
        violator.address = entity.violatorAddress
        violator.otherInformation = entity.violatorOtherInformation
        violator.occurrence = occurrence

        await repositoryViolator.save(violator)
    }

    const history = new OccurrenceHistory()
    history.previousStatus = occurrence.status
    history.newStatus = occurrence.status
    history.occurrence = occurrence

    const repositoryHistory = getRepository(OccurrenceHistory)
    repositoryHistory.save(history)

    return {
        id: occurrence.id,
    }
}

const getCountOccurrencesCitizen = async (
    citizenId: string
): Promise<getCountOccurrencesCitizenResponse> => {
    const repository = getRepository(Occurrence)

    const occurrences = await repository.count({
        where: {
            citizen: {
                id: citizenId,
            },
        },
    })

    return {
        count: occurrences,
    }
}

const getOccurrencesCitizen = async (
    citizenId: string
): Promise<listOccurrencesCitizenResponse[]> => {
    const repository = getRepository(Occurrence)

    const occurrences = await repository.find({
        where: {
            citizen: {
                id: citizenId,
            },
        },
        order: {
            newNotification: 'DESC',
            updatedAt: 'DESC',
        },
    })

    return occurrences.map((occurrence) => ({
        id: occurrence.id,
        category: occurrence.category,
        newNotification: occurrence.newNotification,
        address: {
            address: occurrence.address,
            number: occurrence.number,
            district: occurrence.district,
            reference: occurrence.reference,
            latitude: occurrence.latitude,
            longitude: occurrence.longitude,
        },
        occurrenceNumber: occurrence.occurrenceNumber,
        violationNumber: occurrence.violationNumber,
        status: occurrence.status,
        occurrenceDate: occurrence.occurrenceDate,
    }))
}

const getOccurrenceCitizen = async (
    occurrenceId: string,
    citizenId: string
): Promise<getOccurrenceCitizenResponse> => {
    const occurrence = await getOccurrenceById(occurrenceId)

    if (occurrence.citizen.id != citizenId) {
        throw new ForbiddenError('This occurrence does not belong to citizen')
    }

    return {
        category: occurrence.category,
        status: occurrence.status,
        description: occurrence.description,
        occurrenceDate: occurrence.occurrenceDate,
        newNotification: occurrence.newNotification,
        occurrenceNumber: occurrence.occurrenceNumber,
        violationNumber: occurrence.violationNumber,
        address: {
            address: occurrence.address,
            number: occurrence.number,
            district: occurrence.district,
            reference: occurrence.reference,
            latitude: occurrence.latitude,
            longitude: occurrence.longitude,
        },
        histories: occurrence.histories
            .map((history) => ({
                title: history.newStatus,
                description: history.comment,
                historyDate: history.createdAt,
            }))
            .sort((a, b) =>
                a.historyDate.getTime() > b.historyDate.getTime()
                    ? -1
                    : b.historyDate.getTime() > a.historyDate.getTime()
                    ? 1
                    : 0
            ),
        violator: {
            name: occurrence?.violator?.name,
            vehicle: occurrence?.violator?.vehicle,
            address: occurrence?.violator?.address,
            otherInformation: occurrence?.violator?.otherInformation,
        },
    }
}

const getOccurrencesEmployee = async (
    pagination: pagination,
    filter: string,
    search: string
): Promise<listEmployeeOccurrenceResponse> => {
    const repository = getRepository(Occurrence)

    const page = pagination.page >= 0 ? pagination.page : 0
    const limit = pagination.limit >= 0 ? pagination.limit : 10

    const where: FindConditions<Occurrence>[] = []
    const whereAnd: FindConditions<Occurrence> = {}

    if (filter !== undefined) {
        if (filter === 'read') {
            whereAnd.viewed = true
        } else if (filter === 'unread') {
            whereAnd.viewed = false
        }
    }

    if (Object.keys(whereAnd).length > 0) {
        where.push(whereAnd)
    }

    const countTotalRows = await repository.count({
        where,
    })
    const countTotalPages = Math.ceil(countTotalRows / limit)

    const result = await repository.find({
        order: {
            updatedAt: 'ASC',
        },
        where: where,
        take: limit,
        skip: page * limit,
    })

    return {
        occurrences: result.map((occurrence) => ({
            id: occurrence.id,
            category: occurrence.category,
            address: {
                address: occurrence.address,
                number: occurrence.number,
                district: occurrence.district,
                reference: occurrence.reference,
                latitude: occurrence.latitude,
                longitude: occurrence.longitude,
            },
            occurrenceNumber: occurrence.occurrenceNumber,
            violationNumber: occurrence.violationNumber,
            status: occurrence.status,
            occurrenceDate: occurrence.occurrenceDate,
        })),
        pages: countTotalPages,
    }
}

const getOccurrenceEmployee = async (
    occurrenceId: string
): Promise<getOccurrenceEmployeeResponse> => {
    const occurrence = await getOccurrenceById(occurrenceId)

    return {
        category: occurrence.category,
        status: occurrence.status,
        description: occurrence.description,
        occurrenceDate: occurrence.occurrenceDate,
        newNotification: occurrence.newNotification,
        occurrenceNumber: occurrence.occurrenceNumber,
        violationNumber: occurrence.violationNumber,
        address: {
            address: occurrence.address,
            number: occurrence.number,
            district: occurrence.district,
            reference: occurrence.reference,
            latitude: occurrence.latitude,
            longitude: occurrence.longitude,
        },
        citizen: {
            first_name: occurrence.citizen.first_name,
            last_name: occurrence.citizen.last_name,
            email: occurrence.citizen.email,
            phone_number: occurrence.citizen.phone_number,
        },
        histories: occurrence.histories
            .map((history) => ({
                title: history.newStatus,
                description: history.comment,
                historyDate: history.createdAt,
            }))
            .sort((a, b) =>
                a.historyDate.getTime() > b.historyDate.getTime()
                    ? -1
                    : b.historyDate.getTime() > a.historyDate.getTime()
                    ? 1
                    : 0
            ),
        photos: occurrence.photos.map(
            (photo) => process.env.URL_PHOTOS + '/' + photo.filaname
        ),
        violator: {
            name: occurrence?.violator?.name,
            vehicle: occurrence?.violator?.vehicle,
            address: occurrence?.violator?.address,
            otherInformation: occurrence?.violator?.otherInformation,
        },
        internalComments: occurrence.internalComments
            .map((internalComment) => ({
                comment: internalComment.comment,
                employee:
                    internalComment.employee.first_name +
                    ' ' +
                    internalComment.employee.last_name,
                commentDate: internalComment.createdAt,
            }))
            .sort((a, b) =>
                a.commentDate.getTime() > b.commentDate.getTime()
                    ? -1
                    : b.commentDate.getTime() > a.commentDate.getTime()
                    ? 1
                    : 0
            ),
    }
}

const getOccurrenceEmployeeByNumber = async (
    number: string
): Promise<getOccurrenceEmployeeByIdResponse> => {
    const repository = getRepository(Occurrence)

    const occurrence = await repository.findOne({
        where: {
            occurrenceNumber: number,
        },
    })

    if (occurrence === undefined) {
        throw new NotFoundError('Occurrence not found')
    }

    return {
        id: occurrence.id,
    }
}

const updateOccurrence = async (
    occurrenceId: string,
    employeeId: string,
    entity: updateOccurrenceRequest
) => {
    const repository = getRepository(Occurrence)

    const employee = await getEmployeeById(employeeId)
    const occurrence = await getOccurrenceById(occurrenceId)

    if (entity.occurrenceNumber !== undefined) {
        occurrence.occurrenceNumber = entity.occurrenceNumber
        occurrence.newNotification = true
    }

    if (entity.violationNumber !== undefined) {
        occurrence.violationNumber = entity.violationNumber
        occurrence.newNotification = true
    }

    if (entity.status !== undefined) {
        // create history
        const comment = new OccurrenceHistory()
        comment.previousStatus = occurrence.status
        comment.newStatus = entity.status
        comment.comment = entity.comment || ''
        comment.occurrence = occurrence
        comment.employee = employee

        occurrence.histories.push(comment)

        occurrence.status = entity.status
        occurrence.newNotification = true
    }

    await repository.save(occurrence)
}

const createOccurrenceInternalComment = async (
    occurrenceId: string,
    employeeId: string,
    entity: createOccurrenceInternalComment
) => {
    const repository = getRepository(OccurrenceInternalComment)

    const employee = await getEmployeeById(employeeId)
    const occurrence = await getOccurrenceById(occurrenceId)

    const comment = new OccurrenceInternalComment()
    comment.comment = entity.comment
    comment.occurrence = occurrence
    comment.employee = employee

    await repository.save(comment)
}

const removeOccurrenceNotification = async (
    occurrenceId: string,
    citizenId: string
) => {
    const repository = getRepository(Occurrence)

    const occurrence = await getOccurrenceById(occurrenceId)

    if (occurrence.citizen.id !== citizenId) {
        throw new ForbiddenError('This occurrence does not belong to citizen')
    }

    occurrence.newNotification = false

    await repository.save(occurrence)
}

const createOccurrencePhoto = async (
    occurrenceId: string,
    citizenId: string,
    files?: any
) => {
    const occurrence = await getOccurrenceById(occurrenceId)

    if (occurrence.citizen.id != citizenId) {
        throw new ForbiddenError('This occurrence does not belong to citizen')
    }

    const repository = getRepository(Occurrence)

    const images = (
        Array.isArray(files.files) ? files.files : [files.files]
    ) as uploadedFile[]

    await Promise.all(
        images.map((image) => {
            const [type, extension] = image.mimetype.split('/')

            if (type === undefined || extension === undefined) {
                throw new BadRequestError('Unsupported file')
            }

            if (type !== 'image') {
                throw new BadRequestError('Unsupported file')
            }

            const newFileName = uuid() + '.' + extension

            fs.writeFileSync('./public/' + newFileName, image.data)

            const file = new OccurrencePhoto()
            file.filaname = newFileName

            occurrence.photos.push(file)
        })
    )

    await repository.save(occurrence)
}

const updateOccurrenceDeleteImages = async (occurrenceId: string) => {
    const occurrence = await getOccurrenceById(occurrenceId)

    if (occurrence.viewed) return

    occurrence.deleteImages = true
    occurrence.viewed = true

    const repository = getRepository(Occurrence)
    repository.save(occurrence)
}

const getPhotosToDelete = async (): Promise<Occurrence[]> => {
    const repository = getRepository(Occurrence)

    return await repository.find({
        where: {
            deleteImages: true,
        },
        relations: ['photos'],
    })
}

const deletePhotos = async (occurrenceId: string) => {
    const repository = getRepository(Occurrence)

    const occurrence = await getOccurrenceById(occurrenceId)
    occurrence.deleteImages = false

    await repository.save(occurrence)

    // delete entity photos
    const repositoryPhoto = getRepository(OccurrencePhoto)

    const photos = await repositoryPhoto.find({
        where: {
            occurrence: {
                id: occurrence.id,
            },
        },
    })

    await repositoryPhoto.remove(photos)
}

export {
    getOccurrenceById,
    createOccurrence,
    getCountOccurrencesCitizen,
    getOccurrencesCitizen,
    getOccurrenceCitizen,
    getOccurrencesEmployee,
    getOccurrenceEmployee,
    getOccurrenceEmployeeByNumber,
    updateOccurrence,
    createOccurrenceInternalComment,
    removeOccurrenceNotification,
    createOccurrencePhoto,
    updateOccurrenceDeleteImages,
    getPhotosToDelete,
    deletePhotos,
}
