import { getRepository } from 'typeorm'

import ConflictError from '../exceptions/ConflictError'
import { encrypt } from '../utils/bcrypt'
import uuid from '../utils/uuid'

import Citizen from '../models/Citizen'

const checkExistUserByEmailAndCpf = async (email: string, cpf: string) => {
    const repository = getRepository(Citizen)

    const result = await repository.query(
        `select count(1) as count from citizen where email = ? or cpf = ?`,
        [email, cpf]
    )

    return result[0].count > 0
}

const createCitizen = async (entity: Citizen) => {
    const repository = getRepository(Citizen)

    const existUser = await checkExistUserByEmailAndCpf(
        entity.email,
        entity.cpf
    )

    if (existUser) {
        throw new ConflictError('This email is already in use')
    }

    const citizen = new Citizen()
    citizen.email = entity.email
    citizen.password = await encrypt(entity.password)
    citizen.first_name = entity.first_name
    citizen.last_name = entity.last_name
    citizen.verified_email = false
    citizen.hash_verified_email = uuid()
    citizen.cpf = entity.cpf
    citizen.phone_number = entity.phone_number

    await repository.save(citizen)
}

export { createCitizen }
