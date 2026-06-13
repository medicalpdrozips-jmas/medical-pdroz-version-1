import { isDatabaseEnabled } from '../db/pool.js'

export function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function normalizeText(value) {
  return String(value ?? '').toLowerCase()
}

export function formatCurrencyMillions(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '$0 M'

  return `$${new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) / 1000000)} M`
}

export function formatPercent(value, digits = 1, includeSign = false) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '0%'

  const numericValue = Number(value)
  const prefix = includeSign && numericValue > 0 ? '+' : ''

  return `${prefix}${new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(numericValue)}%`
}

export async function resolveWithFallback(databaseLoader, mockLoader) {
  if (!isDatabaseEnabled()) {
    return mockLoader()
  }

  try {
    const databaseValue = await databaseLoader()

    if (databaseValue === null || databaseValue === undefined) {
      return mockLoader()
    }

    if (Array.isArray(databaseValue) && databaseValue.length === 0) {
      return mockLoader()
    }

    return databaseValue
  } catch {
    return mockLoader()
  }
}
