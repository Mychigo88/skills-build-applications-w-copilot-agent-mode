import { useEffect, useState } from 'react'
import apiBase, { extractRecords } from '../api.js'

export default function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(`${apiBase}/api/users`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        setUsers(extractRecords(await response.json(), 'users'))
      } catch (loadError) {
        setError(loadError.message)
      }
    }

    loadUsers()
  }, [])

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="card-title mb-3">Users</h2>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-muted text-center py-4">
                      No users available.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={`${user.email ?? 'user'}-${index}`}>
                      <td>{user.name ?? 'Unknown athlete'}</td>
                      <td>{user.email ?? '—'}</td>
                      <td>{user.team?.name ?? user.team ?? 'Unassigned'}</td>
                      <td>{user.points ?? 0}</td>
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
