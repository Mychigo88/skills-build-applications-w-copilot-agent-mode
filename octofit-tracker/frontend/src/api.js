const apiBase = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000'

export const endpoints = [
  '/api/activities/',
  '/api/leaderboard/',
  '/api/teams/',
  '/api/users/',
  '/api/workouts/',
].map((path) => apiBase + path)

export default apiBase
