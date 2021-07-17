import 'reflect-metadata'

import dotenv from 'dotenv'
dotenv.config()

import './configs/database'

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
