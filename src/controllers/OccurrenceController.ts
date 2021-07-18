import { Router } from 'express'

import validate from '../utils/validate'
import {
    createOccurrence,
    getOccurrenceCitizen,
    getOccurrencesCitizen,
    getOccurrencesEmployee,
    getOccurrenceEmployee,
    updateOccurrence,
    removeOccurrenceNotification,
    createOccurrenceInternalComment,
} from '../services/OccurrenceService'
import createOccurrenceSchema from '../schemas/Occurrence/createOccurrenceSchema'
import citizenAuthorization from '../middlewares/citizenAuthorization'
import employeeAuthorization from '../middlewares/employeeAuthorization'
import createOccurrenceInternalCommentSchema from '../schemas/Occurrence/createOccurrenceInternalCommentSchema'
import updateOccurrenceSchema from '../schemas/Occurrence/updateOccurrenceSchema'

const routes = Router()

routes.post('/', citizenAuthorization, async (req, res, next) => {
    try {
        const citizenId = (req as any).citizenId
        const values = validate(createOccurrenceSchema, req.body)
        const response = await createOccurrence(citizenId, values)
        res.status(200).send(response)
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

routes.put('/:occurrenceId', employeeAuthorization, async (req, res, next) => {
    try {
        const occurrenceId = req.params.occurrenceId
        const employeeId = (req as any).employeeId
        const values = validate(updateOccurrenceSchema, req.body)
        await updateOccurrence(occurrenceId, employeeId, values)

        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

routes.put(
    '/:occurrenceId/remove-notification',
    citizenAuthorization,
    async (req, res, next) => {
        try {
            const occurrenceId = req.params.occurrenceId
            const citizenId = (req as any).citizenId

            await removeOccurrenceNotification(occurrenceId, citizenId)
            res.status(204).send()
        } catch (err) {
            next(err)
        }
    }
)

routes.post(
    '/:occurrenceId/internal-comment',
    employeeAuthorization,
    async (req, res, next) => {
        try {
            const occurrenceId = req.params.occurrenceId
            const employeeId = (req as any).employeeId
            const values = validate(
                createOccurrenceInternalCommentSchema,
                req.body
            )

            await createOccurrenceInternalComment(
                occurrenceId,
                employeeId,
                values
            )

            res.status(204).send()
        } catch (err) {
            next(err)
        }
    }
)

export default routes
