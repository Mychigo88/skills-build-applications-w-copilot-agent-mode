import { useEffect, useState } from 'react'
import apiBase, { extractRecords } from '../api.js'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch(`${apiBase}/api/leaderboard`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        setLeaderboard(extractRecords(await response.json(), 'leaderboard'))
      } catch (loadError) {
        setError(loadError.message)
      }
    }

    loadLeaderboard()
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="card-title mb-3">Leaderboard</h2>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-muted text-center py-4">
                      No leaderboard data yet.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => (
                    <tr key={`${entry.user?._id ?? entry.team?._id ?? 'entry'}-${index}`}>
                      <td>#{index + 1}</td>
                      <td>{entry.user?.name ?? entry.name ?? 'Unknown athlete'}</td>
                      <td>{entry.team?.name ?? '—'}</td>
                      <td>{entry.points ?? 0}</td>
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
