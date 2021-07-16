import { NextFunction, Request, Response, Router } from 'express'

import CitizenController from './controllers/CitizenController'
import ApiError from './exceptions/ApiError'

const routes = Router()

routes.use('/citizen', CitizenController)

routes.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode != undefined) {
        return res
            .status(err.statusCode)
            .send({ ...err, statusCode: undefined })
    }

    res.status(500).send(err)
    // res.status(500).send({ message: 'Internal error' })
})

export default routes
