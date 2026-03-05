import { useState, useEffect } from 'react'
import { departments } from '../api/client'

export default function Departments() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    departments.list()
      .then((res) => setList(res.data.results ?? res.data))
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="app-page"><div className="loading">Loading…</div></div>
  if (error) return <div className="app-page"><div className="error">{error}</div></div>

  return (
    <div className="app-page">
      <h1>Departments</h1>
      {list.length === 0 ? (
        <div className="empty">No departments yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Doctors</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td><code>{d.code}</code></td>
                  <td>{d.doctor_count ?? 0}</td>
                  <td className="muted">{d.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
