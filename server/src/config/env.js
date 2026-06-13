import { createRequire } from 'node:module'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const require = createRequire(import.meta.url)
const { version } = require('../../package.json')

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue
  return String(value).toLowerCase() === 'true'
}

function toNumber(value, defaultValue) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : defaultValue
}

const rawNodeEnv = process.env.NODE_ENV ?? 'development'
const rawCorsOrigin = process.env.CORS_ORIGIN?.trim() ?? ''
const useDatabase = toBoolean(process.env.USE_DATABASE, false)
const databaseUrl = process.env.DATABASE_URL?.trim() ?? ''

const validationErrors = []
const validationWarnings = []

if (useDatabase && !databaseUrl) {
  validationWarnings.push('USE_DATABASE=true but DATABASE_URL is not configured. Mock fallback will remain active.')
}

if (rawNodeEnv === 'production' && !rawCorsOrigin) {
  validationErrors.push('CORS_ORIGIN must be defined when NODE_ENV=production.')
}

if (validationErrors.length > 0) {
  throw new Error(validationErrors.join(' '))
}

export const env = {
  PORT: toNumber(process.env.PORT, 4000),
  NODE_ENV: rawNodeEnv,
  USE_DATABASE: useDatabase,
  DATABASE_URL: databaseUrl,
  DB_SSL: toBoolean(process.env.DB_SSL, false),
  CORS_ORIGIN: rawCorsOrigin,
  VERSION: version,
}

export function getEnvironmentWarnings() {
  return [...validationWarnings]
}

export function getCorsMode() {
  if (env.NODE_ENV === 'production' && env.CORS_ORIGIN === '*') {
    return 'wildcard'
  }

  return env.NODE_ENV === 'production'
    ? 'configured-origin'
    : 'development-localhost'
}

export function getDatabaseConfigSummary() {
  return {
    enabled: env.USE_DATABASE,
    configured: Boolean(env.DATABASE_URL),
    ssl: env.DB_SSL,
  }
}
