import 'reflect-metadata'

import dotenv from 'dotenv'
dotenv.config()

import './configs/database'
import './utils/tasks'

import express, { json } from 'express'
import helmet from 'helmet'
import fileUpload from 'express-fileupload'

import cors from 'cors'
import routes from './routes'

const app = express()

app.use(fileUpload())
app.use(cors())
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
)
app.use(json())
app.use(routes)
app.use('/public', express.static('public'))

export default app
