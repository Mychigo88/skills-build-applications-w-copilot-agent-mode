const apiBase = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000'

export const endpoints = [
  '/api/activities',
  '/api/leaderboard',
  '/api/teams',
  '/api/users',
  '/api/workouts',
].map((path) => apiBase + path)

export function extractRecords(payload, collectionName) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  for (const key of ['results', 'items', collectionName]) {
    if (Array.isArray(payload[key])) return payload[key]
  }

  return payload.data && typeof payload.data === 'object'
    ? extractRecords(payload.data, collectionName)
    : []
}

export default apiBase
