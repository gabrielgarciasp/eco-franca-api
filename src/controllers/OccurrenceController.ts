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
    createOccurrencePhoto,
    updateOccurrenceDeleteImages,
    getOccurrenceEmployeeByNumber,
    getCountOccurrencesCitizen,
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

routes.get('/citizen/count', citizenAuthorization, async (req, res, next) => {
    try {
        const citizenId = (req as any).citizenId
        const result = await getCountOccurrencesCitizen(citizenId)
        res.status(200).send(result)
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

        const filter = req.query.filter as string
        const search = req.query.search as string

        const result = await getOccurrencesEmployee(pagination, filter, search)

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

routes.get(
    '/employee/number/:occurrenceNumber',
    employeeAuthorization,
    async (req, res, next) => {
        try {
            const result = await getOccurrenceEmployeeByNumber(
                req.params.occurrenceNumber
            )
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

routes.patch(
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

routes.post(
    '/:occurrenceId/photos',
    citizenAuthorization,
    async (req, res, next) => {
        try {
            const occurrenceId = req.params.occurrenceId
            const citizenId = (req as any).citizenId
            await createOccurrencePhoto(occurrenceId, citizenId, req.files)

            res.status(204).send()
        } catch (err) {
            next(err)
        }
    }
)

routes.patch(
    '/:occurrenceId/delete-photos',
    employeeAuthorization,
    async (req, res, next) => {
        try {
            const occurrenceId = req.params.occurrenceId
            await updateOccurrenceDeleteImages(occurrenceId)

            res.status(204).send()
        } catch (err) {
            next(err)
        }
    }
)

export default routes
