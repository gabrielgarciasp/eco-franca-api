import { getRepository } from 'typeorm'

import BadRequestError from '../exceptions/BadRequestError'
import ConflictError from '../exceptions/ConflictError'
import ForbiddenError from '../exceptions/ForbiddenError'
import Employee from '../models/Employee'
import { createEmployeeRequest } from '../types/employee/createEmployeeRequest'
import { loginEmployeeRequest } from '../types/employee/loginEmployeeRequest'
import { loginEmployeeResponse } from '../types/employee/loginEmployeeResponse'
import { compare, encrypt } from '../utils/bcrypt'
import { sign } from '../utils/jwt'

const checkExistEmployeeByEmail = async (email: string) => {
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
        throw new BadRequestError('Employee not found')
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
        throw new BadRequestError(errorMessage || 'Employee not found')
    }

    return employee
}

const createEmployee = async (entity: createEmployeeRequest) => {
    const repository = getRepository(Employee)

    const existUser = await checkExistEmployeeByEmail(entity.email)

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
        throw new BadRequestError('Email or Password incorrect')
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

export {
    checkExistEmployeeByEmail,
    getEmployeeById,
    getEmployeeByEmail,
    createEmployee,
    loginEmployee,
}
