import { useEffect, useState } from 'react'
import apiBase from '../api.js'

const unwrapRecords = (payload) => {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.items)) return payload.items
  if (Array.isArray(payload.teams)) return payload.teams
  return []
}

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await fetch(`${apiBase}/api/teams/`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        setTeams(unwrapRecords(await response.json()))
      } catch (loadError) {
        setError(loadError.message)
      }
    }

    loadTeams()
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="card-title mb-3">Teams</h2>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Members</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-muted text-center py-4">
                      No teams available.
                    </td>
                  </tr>
                ) : (
                  teams.map((team, index) => (
                    <tr key={`${team.name ?? 'team'}-${index}`}>
                      <td>{team.name ?? 'Untitled team'}</td>
                      <td>{Array.isArray(team.members) ? team.members.length : 0}</td>
                      <td>{team.points ?? 0}</td>
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
