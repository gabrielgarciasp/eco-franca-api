import { NextFunction, Request, Response, Router } from 'express'

import CitizenController from './controllers/CitizenController'
import EmployeeController from './controllers/EmployeeController'
import OccurrenceController from './controllers/OccurrenceController'
import ApiError from './exceptions/ApiError'

const routes = Router()

routes.use('/citizen', CitizenController)
routes.use('/employee', EmployeeController)
routes.use('/occurrence', OccurrenceController)

routes.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode != undefined) {
        return res
            .status(err.statusCode)
            .send({ ...err, statusCode: undefined })
    }

    console.log(err);

    res.status(500).send(err)
    // res.status(500).send({ message: 'Internal error' })
})

export default routes
