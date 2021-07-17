import { Router } from 'express'

import loginCitizenSchema from '../schemas/Citizens/loginCitizenSchema'
import createCitizenSchema from '../schemas/Citizens/createCitizenSchema'
import validate from '../utils/validate'
import {
    createCitizen,
    loginCitizen,
    activeEmailCitizen,
} from '../services/CitizenService'

const routes = Router()

routes.post('/', async (req, res, next) => {
    try {
        const values = validate(createCitizenSchema, req.body)
        await createCitizen(values)
        res.status(204).send()
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
        await activeEmailCitizen(req.params.token)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

export default routes
