import { Router } from 'express'

import createEmployeeSchema from '../schemas/Employee/createEmployeeSchema'
import loginEmployeeSchema from '../schemas/Employee/loginEmployeeSchema'
import { createEmployee, loginEmployee } from '../services/EmployeeService'
import { createEmployeeRequest } from '../types/employee/createEmployeeRequest'
import { loginEmployeeRequest } from '../types/employee/loginEmployeeRequest'
import validate from '../utils/validate'

const routes = Router()

routes.post('/', async (req, res, next) => {
    try {
        const values = validate(
            createEmployeeSchema,
            req.body
        ) as createEmployeeRequest

        await createEmployee(values)

        res.status(201).send()
    } catch (err) {
        next(err)
    }
})

routes.post('/login', async (req, res, next) => {
    try {
        const values = validate(
            loginEmployeeSchema,
            req.body
        ) as loginEmployeeRequest

        const response = await loginEmployee(values)

        res.status(200).send(response)
    } catch (err) {
        next(err)
    }
})

export default routes
