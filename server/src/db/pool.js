import pg from 'pg'
import { env } from '../config/env.js'

const { Pool } = pg
const DEFAULT_DISABLED_STATUS = {
  enabled: false,
  connected: false,
  mode: 'mock',
  message: 'PostgreSQL disabled. Using mock fallback.',
}

let pool = null
let databaseStatus = { ...DEFAULT_DISABLED_STATUS }

function createPool() {
  if (!env.USE_DATABASE) {
    return null
  }

  if (!env.DATABASE_URL) {
    databaseStatus = {
      enabled: true,
      connected: false,
      mode: 'fallback-mock',
      message: 'USE_DATABASE=true but DATABASE_URL is missing. Using mock fallback.',
    }
    return null
  }

  try {
    const nextPool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
    })

    nextPool.on('error', (error) => {
      databaseStatus = {
        enabled: true,
        connected: false,
        mode: 'fallback-mock',
        message: `PostgreSQL pool error: ${error.message}. Using mock fallback.`,
      }
      console.error('CRH PostgreSQL pool error:', error.message)
    })

    databaseStatus = {
      enabled: true,
      connected: false,
      mode: 'database-pending',
      message: 'PostgreSQL enabled. Connection will be verified on demand.',
    }

    return nextPool
  } catch (error) {
    databaseStatus = {
      enabled: true,
      connected: false,
      mode: 'fallback-mock',
      message: `PostgreSQL pool initialization failed: ${error.message}. Using mock fallback.`,
    }
    console.error('CRH PostgreSQL init error:', error.message)
    return null
  }
}

pool = createPool()

export function isDatabaseEnabled() {
  return env.USE_DATABASE && Boolean(pool)
}

export function getDatabaseStatus() {
  return { ...databaseStatus }
}

export async function query(sql, params = []) {
  if (!isDatabaseEnabled()) {
    const disabledError = new Error(databaseStatus.message)
    disabledError.code = 'DB_DISABLED'
    throw disabledError
  }

  try {
    const result = await pool.query(sql, params)
    databaseStatus = {
      enabled: true,
      connected: true,
      mode: 'database',
      message: 'PostgreSQL connected.',
    }
    return result
  } catch (error) {
    databaseStatus = {
      enabled: true,
      connected: false,
      mode: 'fallback-mock',
      message: `PostgreSQL unavailable: ${error.message}. Using mock fallback.`,
    }
    console.error('CRH PostgreSQL query error:', error.message)
    throw error
  }
}

export async function checkDatabaseConnection() {
  if (!isDatabaseEnabled()) {
    return getDatabaseStatus()
  }

  try {
    await query('select 1 as ok')
    return getDatabaseStatus()
  } catch {
    return getDatabaseStatus()
  }
}
