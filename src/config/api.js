const DEFAULT_API_URL = 'https://crh-health-intelligence-api-production.up.railway.app'

export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, '')

export function getApiUrl(path = '') {
  if (!path) return API_BASE_URL

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
