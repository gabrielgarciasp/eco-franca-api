import { getRepository } from 'typeorm'

import ConflictError from '../exceptions/ConflictError'
import { encrypt, compare } from '../utils/bcrypt'
import uuid from '../utils/uuid'
import { sign } from '../utils/jwt'
import Citizen from '../models/Citizen'
import NotFoundError from '../exceptions/NotFoundError'
import { loginCitizenResponse } from '../types/citizen/loginCitizenResponse'
import { loginCitizenRequest } from '../types/citizen/loginCitizenRequest'
import { createCitizenRequest } from '../types/citizen/createCitizenRequest'
import { checkExistsCpfCitizenRequest } from '../types/employee/checkExistsCpfCitizenRequest'
import { checkExistsCpfCitizenResponse } from '../types/employee/checkExistsCpfCitizenResponse'
import { checkExistsEmailCitizenRequest } from '../types/employee/checkExistsEmailCitizenRequest'
import { checkExistsEmailCitizenResponse } from '../types/employee/checkExistsEmailCitizenResponse'
import ForbiddenError from '../exceptions/ForbiddenError'
import { sendMail } from '../utils/sendMail'
import templateVerifyEmail from '../emails/verifyEmail'
import templateRecoveryPassword from '../emails/recoveryPassword'
import { checkCpfIsNotNullSchema } from '../types/employee/checkCpfIsNotNullSchema'
import { checkPasswordIsNotNullSchema } from '../types/employee/checkPasswordIsNotNullSchema'

const checkExistsUserByEmailAndCpf = async (email: string, cpf: string) => {
    const repository = getRepository(Citizen)

    const count = await repository.count({
        where: [
            {
                email,
            },
            {
                cpf,
            },
        ],
    })

    return count > 0
}

const getCitizenFromId = async (id: string): Promise<Citizen> => {
    const repository = getRepository(Citizen)

    const result = await repository.findOne({
        where: {
            id,
        },
    })

    if (result == undefined) {
        throw new NotFoundError('Citizen not found')
    }

    return result
}

const getCitizenFromCpf = async (
    cpf: string,
    errorMessage?: string
): Promise<Citizen> => {
    const repository = getRepository(Citizen)

    const result = await repository.findOne({
        where: {
            cpf,
        },
    })

    if (result == undefined) {
        throw new NotFoundError(errorMessage || 'Citizen not found')
    }

    return result
}

const getCitizenFromHash = async (
    hash_update_password: string,
    errorMessage?: string
): Promise<Citizen> => {
    const repository = getRepository(Citizen)

    const result = await repository.findOne({
        where: {
            hash_update_password,
        },
    })

    if (result == undefined) {
        throw new NotFoundError(errorMessage || 'Citizen not found')
    }

    return result
}

const createCitizen = async (entity: createCitizenRequest) => {
    const repository = getRepository(Citizen)

    const existUser = await checkExistsUserByEmailAndCpf(
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

    const bodyEmail = templateVerifyEmail(
        citizen.first_name,
        citizen.hash_verified_email
    )

    await sendMail(entity.email, 'Verificar E-mail', bodyEmail)
}

const loginCitizen = async (
    entity: loginCitizenRequest
): Promise<loginCitizenResponse> => {
    const citizen = await getCitizenFromCpf(
        entity.cpf,
        'CPF or Password incorrect'
    )

    if (!(await compare(entity.password, citizen.password))) {
        throw new NotFoundError('CPF or Password incorrect')
    }

    if (!citizen.verified_email) {
        throw new ForbiddenError('Email not yet verified')
    }

    const token = sign(
        {
            citizenId: citizen.id,
            first_name: citizen.first_name,
            last_name: citizen.last_name,
        },
        60 * 60 * 24 * 30 // 30 days
    )

    return {
        first_name: citizen.first_name,
        last_name: citizen.last_name,
        token,
    }
}

const activeEmailCitizen = async (token: string) => {
    const repository = getRepository(Citizen)

    const citizen = await repository.findOne({
        where: {
            hash_verified_email: token,
        },
    })

    if (citizen === undefined) {
        throw new NotFoundError('Token not found')
    }

    // Não realiza um novo update, pois já está ativo
    if (citizen.verified_email) return

    citizen.verified_email = true

    return repository.save(citizen)
}

const getExistsCitizenByCpf = async (
    entity: checkExistsCpfCitizenRequest
): Promise<checkExistsCpfCitizenResponse> => {
    const repository = getRepository(Citizen)

    const count = await repository.count({
        where: {
            cpf: entity.cpf,
        },
    })

    return {
        exists: count > 0,
    }
}

const getExistsCitizenByEmail = async (
    entity: checkExistsEmailCitizenRequest
): Promise<checkExistsEmailCitizenResponse> => {
    const repository = getRepository(Citizen)

    const count = await repository.count({
        where: {
            email: entity.email,
        },
    })

    return {
        exists: count > 0,
    }
}

const revoceryPasswordCitizen = async (entity: checkCpfIsNotNullSchema) => {
    const repository = getRepository(Citizen)
    const citizen = await getCitizenFromCpf(entity.cpf)

    citizen.hash_update_password = uuid()

    await repository.save(citizen)

    const bodyEmail = templateRecoveryPassword(
        citizen.first_name,
        citizen.hash_update_password
    )

    sendMail(citizen.email, 'Recuperar Senha EcoFranca', bodyEmail)
}

const changePasswordCitizen = async (
    entity: checkPasswordIsNotNullSchema,
    hash: string
) => {
    const repository = getRepository(Citizen)
    const citizen = await getCitizenFromHash(hash)

    citizen.hash_update_password = ''
    citizen.password = await encrypt(entity.password)

    await repository.save(citizen)
}

export {
    checkExistsUserByEmailAndCpf,
    getCitizenFromId,
    getCitizenFromCpf,
    createCitizen,
    loginCitizen,
    activeEmailCitizen,
    getExistsCitizenByCpf,
    getExistsCitizenByEmail,
    revoceryPasswordCitizen,
    changePasswordCitizen,
}
