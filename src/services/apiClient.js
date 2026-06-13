import { getApiUrl } from '../config/api'

const DEFAULT_TIMEOUT_MS = 5000

function createTimeoutSignal(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  return { controller, timeoutId }
}

async function fetchJson(path, options = {}) {
  const { timeoutMs, ...fetchOptions } = options
  const { controller, timeoutId } = createTimeoutSignal(timeoutMs)

  try {
    const response = await fetch(getApiUrl(path), {
      ...fetchOptions,
      headers: {
        Accept: 'application/json',
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('API request timed out', { cause: error })
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export function getApiHealth() {
  return fetchJson('/api/health')
}

export function getApiRuntime() {
  return fetchJson('/api/runtime')
}

export function getApiDbStatus() {
  return fetchJson('/api/db/status')
}

export async function getRuntimeDiagnostics() {
  const [health, runtime] = await Promise.all([
    getApiHealth(),
    getApiRuntime(),
  ])

  return {
    health,
    runtime,
    connected: true,
  }
}

export async function getSystemStatus() {
  const [health, runtime, database] = await Promise.all([
    getApiHealth(),
    getApiRuntime(),
    getApiDbStatus(),
  ])

  return {
    health,
    runtime,
    database,
    connected: true,
  }
}
