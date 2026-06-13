import cors from 'cors'
import express from 'express'
import { env, getCorsMode } from './config/env.js'
import { contractsRouter } from './routes/contracts.routes.js'
import { crhAssistRouter } from './routes/crhAssist.routes.js'
import { dbRouter } from './routes/db.routes.js'
import { patientsRouter } from './routes/patients.routes.js'
import { getDatabaseStatus } from './db/pool.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

export function createApp() {
  const app = express()
  const allowedDevelopmentOrigins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
  ])

  app.use(cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true)
        return
      }

      if (env.NODE_ENV === 'production') {
        callback(null, origin === env.CORS_ORIGIN)
        return
      }

      callback(null, allowedDevelopmentOrigins.has(origin))
    },
  }))
  app.use(express.json())

  app.get('/api/health', (req, res) => {
    const databaseStatus = getDatabaseStatus()

    res.json({
      status: 'ok',
      service: 'CRH Health Intelligence API',
      mode: databaseStatus.mode,
      timestamp: new Date().toISOString(),
    })
  })

  app.get('/api/runtime', (req, res) => {
    const databaseStatus = getDatabaseStatus()

    res.json({
      service: 'CRH Health Intelligence API',
      environment: env.NODE_ENV,
      databaseMode: databaseStatus.mode,
      corsMode: getCorsMode(),
      version: env.VERSION,
      timestamp: new Date().toISOString(),
    })
  })

  app.use('/api/db', dbRouter)
  app.use('/api/patients', patientsRouter)
  app.use('/api/contracts', contractsRouter)
  app.use('/api/crh-assist', crhAssistRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
