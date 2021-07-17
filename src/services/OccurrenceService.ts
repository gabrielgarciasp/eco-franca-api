import { getRepository } from 'typeorm'

import Occurrence from '../models/Occurrence'
import { crateOccurrenceRequest } from '../types/occurrence/crateOccurrenceRequest'
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

const getOccurrenceCitizen = async (
    citizenId: string
): Promise<Occurrence[]> => {
    const repository = getRepository(Occurrence)

    return await repository
        .createQueryBuilder('occurrence')
        .where('occurrence.citizenId = :citizenId')
        .setParameters({
            citizenId,
        })
        .getMany()
}

export { createOccurrence, getOccurrenceCitizen }
