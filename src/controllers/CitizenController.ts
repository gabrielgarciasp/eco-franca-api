import { Router } from 'express'

import loginCitizenSchema from '../schemas/Citizens/loginCitizenSchema'
import createCitizenSchema from '../schemas/Citizens/createCitizenSchema'
import validate from '../utils/validate'
import {
    createCitizen,
    loginCitizen,
    activeEmailCitizen,
    getExistsCitizenByCpf,
    getExistsCitizenByEmail,
    recoveryPasswordCitizen,
    changePasswordCitizen,
} from '../services/CitizenService'
import checkExistsCpfSchema from '../schemas/Citizens/checkExistsCpfSchema'
import checkExistsEmailSchema from '../schemas/Citizens/checkExistsEmailSchema'
import checkCpfIsNotNullSchema from '../schemas/Citizens/checkCpfIsNotNullSchema'
import checkPasswordIsNotNullSchema from '../schemas/Citizens/checkPasswordIsNotNullSchema'

const routes = Router()

routes.post('/', async (req, res, next) => {
    try {
        const values = validate(createCitizenSchema, req.body)
        await createCitizen(values)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

routes.post('/login', async (req, res, next) => {
    try {
        const values = validate(loginCitizenSchema, req.body)
        const response = await loginCitizen(values)
        res.status(200).send(response)
    } catch (err) {
        next(err)
    }
})

routes.post('/active/:token', async (req, res, next) => {
    try {
        await activeEmailCitizen(req.params.token)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

routes.post('/check-exists-cpf', async (req, res, next) => {
    try {
        const values = validate(checkExistsCpfSchema, req.body)
        const response = await getExistsCitizenByCpf(values)
        res.status(200).send(response)
    } catch (err) {
        next(err)
    }
})

routes.post('/check-exists-email', async (req, res, next) => {
    try {
        const values = validate(checkExistsEmailSchema, req.body)
        const response = await getExistsCitizenByEmail(values)
        res.status(200).send(response)
    } catch (err) {
        next(err)
    }
})

routes.post('/recovery-password', async (req, res, next) => {
    try {
        const values = validate(checkCpfIsNotNullSchema, req.body)

        await recoveryPasswordCitizen(values)

        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

routes.patch('/recovery-password/:hash', async (req, res, next) => {
    try {
        const values = validate(checkPasswordIsNotNullSchema, req.body)
        const { hash } = req.params

        await changePasswordCitizen(values, hash)

        res.status(204).send()
    } catch (err) {
        next(err)
    }
})

export default routes
