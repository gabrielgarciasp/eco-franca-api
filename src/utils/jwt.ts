import jwt, { JwtPayload } from 'jsonwebtoken'
import ApiError from '../exceptions/ApiError'

const jwtSecret = process.env.JWT_SECRET || 'myjwtsecret123'

const sign = (object: object, expires?: number): string => {
    return jwt.sign(object, jwtSecret, { expiresIn: expires || 900 }) // 15 min
}

const verify = (token: string): string | jwt.JwtPayload => {
    try {
        return jwt.verify(token, jwtSecret)
    } catch {
        throw new ApiError(400, 'Token invalid')
    }
}

export { sign, verify }
