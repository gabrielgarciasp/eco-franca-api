import { getRepository } from 'typeorm'

import ConflictError from '../exceptions/ConflictError'
import ForbiddenError from '../exceptions/ForbiddenError'
import NotFoundError from '../exceptions/NotFoundError'
import Employee from '../models/Employee'
import { checkEmailIsNotNullEmployeeRequest } from '../types/employee/checkEmailIsNotNullEmployeeRequest'
import { createEmployeeRequest } from '../types/employee/createEmployeeRequest'
import { loginEmployeeRequest } from '../types/employee/loginEmployeeRequest'
import { loginEmployeeResponse } from '../types/employee/loginEmployeeResponse'
import { compare, encrypt } from '../utils/bcrypt'
import { sign } from '../utils/jwt'
import { sendMail } from '../utils/sendMail'
import uuid from '../utils/uuid'
import templateRecoveryPassword from '../emails/recoveryPassword'
import { checkPasswordIsNotNullEmployeeRequest } from '../types/employee/checkPasswordIsNotNullEmployeeRequest'

const checkExistsEmployeeByEmail = async (email: string) => {
    const repository = getRepository(Employee)

    const count = await repository.count({
        where: {
            email,
        },
    })

    return count > 0
}

const getEmployeeById = async (id: string): Promise<Employee> => {
    const repository = getRepository(Employee)

    const employee = await repository.findOne({
        where: {
            id,
        },
    })

    if (employee === undefined) {
        throw new NotFoundError('Employee not found')
    }

    return employee
}

const getEmployeeByEmail = async (
    email: string,
    errorMessage?: string
): Promise<Employee> => {
    const repository = getRepository(Employee)

    const employee = await repository.findOne({
        where: {
            email: email,
        },
    })

    if (employee === undefined) {
        throw new NotFoundError(errorMessage || 'Employee not found')
    }

    return employee
}

const getEmployeeByHash = async (
    hash: string,
    errorMessage?: string
): Promise<Employee> => {
    const repository = getRepository(Employee)

    const employee = await repository.findOne({
        where: {
            hash_update_password: hash,
        },
    })

    if (employee === undefined) {
        throw new NotFoundError(errorMessage || 'Employee not found')
    }

    return employee
}

const createEmployee = async (entity: createEmployeeRequest) => {
    const repository = getRepository(Employee)

    const existUser = await checkExistsEmployeeByEmail(entity.email)

    if (existUser) {
        throw new ConflictError('This email is already in use')
    }

    const employee = new Employee()
    employee.email = entity.email
    employee.password = await encrypt(entity.password)
    employee.first_name = entity.first_name
    employee.last_name = entity.last_name
    employee.ra = entity.ra

    await repository.save(employee)
}

const loginEmployee = async (
    entity: loginEmployeeRequest
): Promise<loginEmployeeResponse> => {
    const employee = await getEmployeeByEmail(
        entity.email,
        'Email or Password incorrect'
    )

    if (!(await compare(entity.password, employee.password))) {
        throw new NotFoundError('Email or Password incorrect')
    }

    if (!employee.active) {
        throw new ForbiddenError('Employee not active')
    }

    const token = sign(
        {
            employeeId: employee.id,
            first_name: employee.first_name,
            last_name: employee.last_name,
        },
        60 * 60 * 12 // 12 hrs
    )

    return {
        first_name: employee.first_name,
        last_name: employee.last_name,
        token,
    }
}

const recoveryPasswordEmployee = async (
    entity: checkEmailIsNotNullEmployeeRequest
) => {
    const repository = getRepository(Employee)
    const employee = await getEmployeeByEmail(entity.email)

    employee.hash_update_password = uuid()

    await repository.save(employee)

    const urlChangePassword = `${process.env.URL_RECOVERY_PASSWORD}/${employee.hash_update_password}`

    const bodyEmail = templateRecoveryPassword(
        employee.first_name,
        urlChangePassword
    )

    if (process.env.SEND_EMAIL == 'true') {
        sendMail(employee.email, 'Recuperar Senha EcoFranca', bodyEmail)
    }
}

const changePasswordEmployee = async (
    entity: checkPasswordIsNotNullEmployeeRequest,
    hash: string
) => {
    const repository = getRepository(Employee)
    const employee = await getEmployeeByHash(hash)

    employee.hash_update_password = ''
    employee.password = await encrypt(entity.password)

    await repository.save(employee)
}

export {
    checkExistsEmployeeByEmail,
    getEmployeeById,
    getEmployeeByEmail,
    createEmployee,
    loginEmployee,
    recoveryPasswordEmployee,
    changePasswordEmployee,
}
