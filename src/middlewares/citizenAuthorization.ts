import { NextFunction, Request, Response } from 'express'

import { getUserFromId } from '../services/CitizenService'
import BadRequestError from '../exceptions/BadRequestError'
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
        (req as any).citizenId = tokenDecoded.citizenId
    } catch (err) {
        return next(new BadRequestError('Token invalid'))
    }

    try {
        await getUserFromId(tokenDecoded.citizenId)
    } catch (err) {
        return next(err)
    }

    next()
}
