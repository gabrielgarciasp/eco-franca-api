import { Router } from 'express'

import employeeAuthorization from '../middlewares/employeeAuthorization'
import checkEmailIsNotNullEmployeeSchema from '../schemas/Employee/checkEmailIsNotNullEmployeeSchema'
import checkPasswordIsNotNullRequest from '../schemas/Employee/checkPasswordIsNotNullRequest'
import createEmployeeSchema from '../schemas/Employee/createEmployeeSchema'
import loginEmployeeSchema from '../schemas/Employee/loginEmployeeSchema'
import {
    changePasswordEmployee,
    createEmployee,
    loginEmployee,
    recoveryPasswordEmployee,
} from '../services/EmployeeService'
import validate from '../utils/validate'

const routes = Router()

routes.post('/', employeeAuthorization, async (req, res, next) => {
    try {
        const values = validate(createEmployeeSchema, req.body)
        await createEmployee(values)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

routes.post('/login', async (req, res, next) => {
    try {
        const values = validate(loginEmployeeSchema, req.body)
        const response = await loginEmployee(values)
        res.status(200).send(response)
    } catch (err) {
        next(err)
    }
})

routes.post('/recovery-password', async (req, res, next) => {
    try {
        const values = validate(checkEmailIsNotNullEmployeeSchema, req.body)

        await recoveryPasswordEmployee(values)

        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

routes.patch('/recovery-password/:hash', async (req, res, next) => {
    try {
        const values = validate(checkPasswordIsNotNullRequest, req.body)
        const { hash } = req.params

        await changePasswordEmployee(values, hash)

        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

export default routes
