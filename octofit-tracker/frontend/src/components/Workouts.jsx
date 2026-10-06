import { useEffect, useState } from 'react'
import apiBase, { extractRecords } from '../api.js'

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const response = await fetch(`${apiBase}/api/workouts`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        setWorkouts(extractRecords(await response.json(), 'workouts'))
      } catch (loadError) {
        setError(loadError.message)
      }
    }

    loadWorkouts()
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="card-title mb-3">Workouts</h2>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="row g-3">
            {workouts.length === 0 ? (
              <div className="col-12 text-muted text-center py-4">No workouts available.</div>
            ) : (
              workouts.map((workout, index) => (
                <div className="col-md-6 col-xl-4" key={`${workout.title ?? 'workout'}-${index}`}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="h5 mb-0">{workout.title ?? 'Workout'}</h3>
                        <span className="badge bg-success">{workout.difficulty ?? 'Beginner'}</span>
                      </div>
                      <p className="text-muted mb-2">{workout.activityType ?? 'General fitness'}</p>
                      <p className="mb-2">{workout.description ?? 'No description available.'}</p>
                      <small className="text-body-secondary">
                        {workout.durationMinutes ?? 0} minutes
                      </small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
