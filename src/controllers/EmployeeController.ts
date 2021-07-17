import { Router } from 'express'

import employeeAuthorization from '../middlewares/employeeAuthorization'
import createEmployeeSchema from '../schemas/Employee/createEmployeeSchema'
import loginEmployeeSchema from '../schemas/Employee/loginEmployeeSchema'
import { createEmployee, loginEmployee } from '../services/EmployeeService'
import validate from '../utils/validate'

const routes = Router()

routes.post('/', employeeAuthorization, async (req, res, next) => {
    try {
        const values = validate(createEmployeeSchema, req.body)
        await createEmployee(values)
        res.status(201).send()
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

export default routes
