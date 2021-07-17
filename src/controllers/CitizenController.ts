import { Router } from 'express'
import loginCitizenSchema from '../schemas/Citizens/loginCitizenSchema'
import createCitizenSchema from '../schemas/Citizens/createCitizenSchema'
import activeEmailCitizenSchema from '../schemas/Citizens/activeEmailCitizenSchema'
import validate from '../utils/validate'

import {
    createCitizen,
    loginCitizen,
    activeEmailCitizen,
} from '../services/CitizenService'
import { activeEmailCitizenRequest } from '../types/citizen/activeEmailCitizenRequest'

const routes = Router()

routes.post('/', async (req, res, next) => {
    try {
        const values = validate(createCitizenSchema, req.body)
        await createCitizen(values)
        res.status(201).send()
    } catch (err) {
        next(err)
    }
})

routes.post('/login', async (req, res, next) => {
    try {
        const values = validate(loginCitizenSchema, req.body)
        const response = await loginCitizen(values)
        res.status(200).send(response)
    } catch (err) {
        next(err)
    }
})

routes.post('/active/:token', async (req, res, next) => {
    try {
        const values = validate(
            activeEmailCitizenSchema,
            req.params as object
        ) as activeEmailCitizenRequest
        await activeEmailCitizen(values.token)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

export default routes
