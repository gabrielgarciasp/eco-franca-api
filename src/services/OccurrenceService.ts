import { getRepository } from 'typeorm'

import ForbiddenError from '../exceptions/ForbiddenError'
import NotFoundError from '../exceptions/NotFoundError'
import Occurrence from '../models/Occurrence'
import { crateOccurrenceRequest } from '../types/occurrence/crateOccurrenceRequest'
import { listEmployeeOccurrenceResponse } from '../types/occurrence/listEmployeeOccurrenceResponse'
import { pagination } from '../types/pagination'
import { getUserFromId } from './CitizenService'

const createOccurrence = async (entity: crateOccurrenceRequest) => {
    const repository = getRepository(Occurrence)

    const occurrence = new Occurrence()
    occurrence.category = entity.category
    occurrence.status = 'created'
    occurrence.description = entity.description
    occurrence.cep = entity.cep
    occurrence.address = entity.address
    occurrence.number = entity.number
    occurrence.district = entity.district
    occurrence.reference = entity.reference
    occurrence.latitude = entity.latitude
    occurrence.longitude = entity.longitude
    occurrence.citizen = await getUserFromId(entity.citizenId)

    repository.save(occurrence)
}

const getOccurrencesCitizen = async (
    citizenId: string
): Promise<Occurrence[]> => {
    const repository = getRepository(Occurrence)

    return await repository
        .createQueryBuilder('occurrence')
        .where('occurrence.citizenId = :citizenId')
        .setParameters({
            citizenId,
        })
        .orderBy('occurrence.newNotification', 'DESC')
        .addOrderBy('occurrence.updatedAt', 'DESC')
        .getMany()
}

const getOccurrenceCitizen = async (
    occurrenceId: string,
    citizenId: string
): Promise<Occurrence | undefined> => {
    const repository = getRepository(Occurrence)

    const occurrence = await repository.findOne(occurrenceId, {
        relations: ['citizen', 'histories', 'photos'],
    })

    if (occurrence == undefined) {
        throw new NotFoundError('Occurrence not found')
    }

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
    const repository = getRepository(Occurrence)

    const occurrence = await repository.findOne(occurrenceId, {
        relations: ['citizen', 'histories', 'photos', 'internalComments'],
    })

    if (occurrence == undefined) {
        throw new NotFoundError('Occurrence not found')
    }

    return occurrence
}

export {
    createOccurrence,
    getOccurrencesCitizen,
    getOccurrenceCitizen,
    getOccurrencesEmployee,
    getOccurrenceEmployee,
}
