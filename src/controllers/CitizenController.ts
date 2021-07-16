import { Router } from 'express'
import createCitizenSchema from '../schemas/Citizens/createCitizenSchema'
import validate from '../utils/validate'

import { createCitizen } from '../services/CitizenService'

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

export default routes
