import { Router } from 'express'
import { getDatabaseStatus } from '../controllers/db.controller.js'

export const dbRouter = Router()

dbRouter.get('/status', getDatabaseStatus)
