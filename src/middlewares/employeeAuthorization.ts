import { NextFunction, Request, Response } from 'express'

import BadRequestError from '../exceptions/BadRequestError'
import { getEmployeeById } from '../services/EmployeeService'
import { verify } from '../utils/jwt'

export default async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (authHeader == undefined) {
        return next(new BadRequestError('No token provided'))
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2) {
        return next(new BadRequestError('Token invalid'))
    }

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
        return next(new BadRequestError('Token malformated'))
    }

    let tokenDecoded: any

    try {
        tokenDecoded = verify(token) as any
        (req as any).employeeId = tokenDecoded.employeeId
    } catch (err) {
        return next(new BadRequestError('Token invalid'))
    }

    try {
        await getEmployeeById(tokenDecoded.employeeId)
    } catch (err) {
        return next(err)
    }

    next()
}
