import { Router } from 'express'

import validate from '../utils/validate'
import {
    createOccurrence,
    getOccurrenceCitizen,
    getOccurrencesCitizen,
    getOccurrencesEmployee,
    getOccurrenceEmployee,
} from '../services/OccurrenceService'
import createOccurrenceSchema from '../schemas/Occurrence/createOccurrenceSchema'
import citizenAuthorization from '../middlewares/citizenAuthorization'
import employeeAuthorization from '../middlewares/employeeAuthorization'

const routes = Router()

routes.post('/', citizenAuthorization, async (req, res, next) => {
    try {
        const values = validate(createOccurrenceSchema, {
            ...req.body,
            citizenId: (req as any).citizenId,
        })

        await createOccurrence(values)

        res.status(201).send()
    } catch (err) {
        next(err)
    }
})

routes.get('/citizen/list', citizenAuthorization, async (req, res, next) => {
    try {
        const citizenId = (req as any).citizenId
        const result = await getOccurrencesCitizen(citizenId)
        res.status(200).send(result)
    } catch (err) {
        next(err)
    }
})

routes.get(
    '/citizen/:occurrenceId',
    citizenAuthorization,
    async (req, res, next) => {
        try {
            const occurrenceId = req.params.occurrenceId
            const citizenId = (req as any).citizenId
            const result = await getOccurrenceCitizen(occurrenceId, citizenId)
            res.status(200).send(result)
        } catch (err) {
            next(err)
        }
    }
)

routes.get('/employee/list', employeeAuthorization, async (req, res, next) => {
    try {
        const pagination = {
            page: parseInt(req.query.page as string),
            limit: parseInt(req.query.limit as string),
        }

        const result = await getOccurrencesEmployee(pagination)

        res.status(200).send(result)
    } catch (err) {
        next(err)
    }
})

routes.get(
    '/employee/:occurrenceId',
    employeeAuthorization,
    async (req, res, next) => {
        try {
            const result = await getOccurrenceEmployee(req.params.occurrenceId)
            res.status(200).send(result)
        } catch (err) {
            next(err)
        }
    }
)

export default routes
