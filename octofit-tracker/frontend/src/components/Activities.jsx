import { useEffect, useState } from 'react'
import apiBase from '../api.js'

const unwrapRecords = (payload) => {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.items)) return payload.items
  if (Array.isArray(payload.activities)) return payload.activities
  return []
}

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch(`${apiBase}/api/activities/`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        setActivities(unwrapRecords(await response.json()))
      } catch (loadError) {
        setError(loadError.message)
      }
    }

    loadActivities()
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="card-title mb-3">Activities</h2>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Type</th>
                  <th>User</th>
                  <th>Minutes</th>
                  <th>Distance</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-muted text-center py-4">
                      No activities logged.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity, index) => (
                    <tr key={`${activity.type ?? 'activity'}-${index}`}>
                      <td>{activity.type ?? 'Workout'}</td>
                      <td>{activity.user?.name ?? 'Unknown user'}</td>
                      <td>{activity.durationMinutes ?? 0}</td>
                      <td>{activity.distanceKm ?? 0} km</td>
                      <td>{activity.points ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
