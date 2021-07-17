import { getRepository } from 'typeorm'

import ConflictError from '../exceptions/ConflictError'
import { encrypt, compare } from '../utils/bcrypt'
import uuid from '../utils/uuid'
import { sign } from '../utils/jwt'
import Citizen from '../models/Citizen'
import NotFoundError from '../exceptions/NotFoundError'
import { loginCitizenResponse } from '../types/citizen/loginCitizenResponse'
import { loginCitizenRequest } from '../types/citizen/loginCitizenRequest'
import UnauthorizedError from '../exceptions/UnauthorizedError'
import BadRequestError from '../exceptions/BadRequestError'

const checkExistUserByEmailAndCpf = async (email: string, cpf: string) => {
    const repository = getRepository(Citizen)

    const { count } = await repository
        .createQueryBuilder('citizen')
        .select('count(1)', 'count')
        .where('citizen.email = :email')
        .orWhere('citizen.cpf = :cpf')
        .setParameters({ email, cpf })
        .getRawOne()

    return count > 0
}

const getUserFromCpf = async (cpf: string): Promise<Citizen> => {
    const repository = getRepository(Citizen)

    const result = await repository
        .createQueryBuilder('citizen')
        .where('citizen.cpf = :cpf')
        .setParameters({
            cpf,
        })
        .getOne()

    if (result == undefined) {
        throw new BadRequestError('CPF or Password incorrect')
    }

    return result
}

const getUserFromId = async (id: string): Promise<Citizen> => {
    const repository = getRepository(Citizen)

    const result = await repository
        .createQueryBuilder('citizen')
        .where('citizen.id = :id')
        .setParameters({
            id,
        })
        .getOne()

    if (result == undefined) {
        throw new NotFoundError('Citizen not found')
    }

    return result
}

const createCitizen = async (entity: Citizen) => {
    const repository = getRepository(Citizen)

    const existUser = await checkExistUserByEmailAndCpf(
        entity.email,
        entity.cpf
    )

    if (existUser) {
        throw new ConflictError('This email or cpf is already in use')
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

const loginCitizen = async (
    entity: loginCitizenRequest
): Promise<loginCitizenResponse> => {
    const citizen = await getUserFromCpf(entity.cpf)

    if (!(await compare(entity.password, citizen.password))) {
        throw new BadRequestError('CPF or Password incorrect')
    }

    if (!citizen.verified_email) {
        throw new UnauthorizedError('Email not yet verified')
    }

    const token = sign(
        {
            citizenId: citizen.id,
            first_name: citizen.first_name,
            last_name: citizen.last_name,
        },
        60 * 60 * 24 * 30
    ) // 30 days

    return {
        first_name: citizen.first_name,
        last_name: citizen.last_name,
        token,
    }
}

const activeEmailCitizen = async (token: string) => {
    const repository = getRepository(Citizen)

    const citizen = await repository
        .createQueryBuilder('citizen')
        .where('citizen.hash_verified_email = :token')
        .setParameters({
            token,
        })
        .getOne()

    if (citizen == undefined) {
        throw new NotFoundError('Token not found')
    }

    // Não realiza um novo update, pois já está ativo
    if (citizen.verified_email) return

    citizen.verified_email = true

    return repository.save(citizen)
}

export { createCitizen, loginCitizen, activeEmailCitizen, getUserFromId }
