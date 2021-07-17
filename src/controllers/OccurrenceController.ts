import { Router } from 'express'

import validate from '../utils/validate'
import {
    createOccurrence,
    getOccurrenceCitizen,
} from '../services/OccurrenceService'
import createOccurrenceSchema from '../schemas/Occurrence/createOccurrenceSchema'
import { crateOccurrenceRequest } from '../types/occurrence/crateOccurrenceRequest'
import citizenAuthorization from '../middlewares/citizenAuthorization'

const routes = Router()

routes.post('/', citizenAuthorization, async (req, res, next) => {
    try {
        const values = validate(createOccurrenceSchema, {
            ...req.body,
            citizenId: (req as any).citizenId,
        }) as crateOccurrenceRequest

        await createOccurrence(values)

        res.status(201).send()
    } catch (err) {
        next(err)
    }
})

routes.get('/citizen/list', citizenAuthorization, async (req, res, next) => {
    try {
        const result = await getOccurrenceCitizen((req as any).citizenId)

        res.status(201).send(result)
    } catch (err) {
        next(err)
    }
})

export default routes
