import { getRepository } from 'typeorm'

import ForbiddenError from '../exceptions/ForbiddenError'
import NotFoundError from '../exceptions/NotFoundError'
import Occurrence from '../models/Occurrence'
import OccurrenceHistory from '../models/OccurrenceHistory'
import OccurrenceInternalComment from '../models/OccurrenceInternalComment'
import OccurrenceViolator from '../models/OccurrenceViolator'
import { crateOccurrenceRequest } from '../types/occurrence/crateOccurrenceRequest'
import { createOccurrenceInternalComment } from '../types/occurrence/createOccurrenceInternalComment'
import { listEmployeeOccurrenceResponse } from '../types/occurrence/listEmployeeOccurrenceResponse'
import { updateOccurrenceRequest } from '../types/occurrence/updateOccurrenceRequest'
import { pagination } from '../types/pagination'
import { getCitizenFromId } from './CitizenService'
import { getEmployeeById } from './EmployeeService'

const getOccurrenceById = async (occurrenceId: string): Promise<Occurrence> => {
    const repository = getRepository(Occurrence)

    const occurrence = await repository.findOne(occurrenceId, {
        relations: ['citizen', 'histories', 'photos', 'internalComments'],
    })

    if (occurrence === undefined) {
        throw new NotFoundError('Occurrence not found')
    }

    return occurrence
}

const createOccurrence = async (
    citizenId: string,
    entity: crateOccurrenceRequest
) => {
    const repository = getRepository(Occurrence)

    const occurrence = new Occurrence()
    occurrence.category = entity.category
    occurrence.status = 'created'
    occurrence.description = entity.description
    occurrence.address = entity.address
    occurrence.number = entity.number
    occurrence.district = entity.district
    occurrence.reference = entity.reference
    occurrence.latitude = entity.latitude
    occurrence.longitude = entity.longitude
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
}

const getOccurrencesCitizen = async (
    citizenId: string
): Promise<Occurrence[]> => {
    const repository = getRepository(Occurrence)

    return await repository.find({
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
}

const getOccurrenceCitizen = async (
    occurrenceId: string,
    citizenId: string
): Promise<Occurrence | undefined> => {
    const occurrence = await getOccurrenceById(occurrenceId)

    if (occurrence.citizen.id != citizenId) {
        throw new ForbiddenError('This occurrence does not belong to citizen')
    }

    return occurrence
}

const getOccurrencesEmployee = async (
    pagination: pagination
): Promise<listEmployeeOccurrenceResponse> => {
    const repository = getRepository(Occurrence)

    const page = pagination.page >= 0 ? pagination.page : 0
    const limit = pagination.limit >= 0 ? pagination.limit : 10

    const countTotalRows = await repository.count()
    const countTotalPages = Math.ceil(countTotalRows / limit)

    const result = await repository.find({
        order: {
            updatedAt: 'ASC',
        },
        take: limit,
        skip: page * limit,
    })

    return {
        occurrence: result,
        pages: countTotalPages,
    }
}

const getOccurrenceEmployee = async (
    occurrenceId: string
): Promise<Occurrence> => {
    return await getOccurrenceById(occurrenceId)
}

const updateOccurrence = async (
    occurrenceId: string,
    employeeId: string,
    entity: updateOccurrenceRequest
) => {
    const repository = getRepository(Occurrence)

    const employee = await getEmployeeById(employeeId)
    const occurrence = await getOccurrenceById(occurrenceId)

    if (occurrence.number !== undefined) {
        occurrence.number = entity.number
        occurrence.newNotification = true
    }

    if (occurrence.violationNumber !== undefined) {
        occurrence.violationNumber = entity.violationNumber
        occurrence.newNotification = true
    }

    if (occurrence.status) {
        // create history
        const comment = new OccurrenceHistory()
        comment.previousStatus = occurrence.status
        comment.newStatus = entity.status
        comment.comment = entity.comment || ''
        comment.occurrence = occurrence
        comment.employee = employee

        await createHistory(comment)

        occurrence.status = entity.status
        occurrence.newNotification = true
    }

    await repository.save(occurrence)
}

const createHistory = async (history: OccurrenceHistory) => {
    const repository = getRepository(OccurrenceHistory)
    await repository.save(history)
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

export {
    getOccurrenceById,
    createOccurrence,
    getOccurrencesCitizen,
    getOccurrenceCitizen,
    getOccurrencesEmployee,
    getOccurrenceEmployee,
    updateOccurrence,
    createHistory,
    createOccurrenceInternalComment,
    removeOccurrenceNotification,
}
