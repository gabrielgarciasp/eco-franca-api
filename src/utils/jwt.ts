import jwt, { JwtPayload } from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'myjwtsecret123'

const sign = (object: object, expires?: number): string => {
    return jwt.sign(object, jwtSecret, { expiresIn: expires || 900 }) // 15 min
}

const verify = (token: string): string | jwt.JwtPayload => {
    return jwt.verify(token, jwtSecret)
}

export { sign, verify }
