import 'reflect-metadata'
import './configs/database'

import dotenv from 'dotenv'
dotenv.config()

import express, { json } from 'express'
import helmet from 'helmet'

import cors from 'cors'
import routes from './routes'

const app = express()

app.use(helmet())
app.use(cors())
app.use(json())
app.use(routes)

export default app
