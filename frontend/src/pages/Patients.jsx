import { useState, useEffect } from 'react'
import { patients as patientsApi } from '../api/client'

function formatDate(s) {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleDateString()
  } catch {
    return s
  }
}

export default function Patients() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    first_name: '', last_name: '', date_of_birth: '', gender: '', phone: '', email: '', address: '', emergency_contact: '',
  })

  const load = () => {
    patientsApi.list()
      .then((res) => setList(res.data.results ?? res.data))
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (!payload.date_of_birth) payload.date_of_birth = null
    patientsApi.create(payload)
      .then(() => {
        setShowForm(false)
        setForm({ first_name: '', last_name: '', date_of_birth: '', gender: '', phone: '', email: '', address: '', emergency_contact: '' })
        load()
      })
      .catch((err) => setError(err.response?.data ? JSON.stringify(err.response.data) : err.message))
  }

  if (loading) return <div className="app-page"><div className="loading">Loading…</div></div>

  return (
    <div className="app-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Patients</h1>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Patient'}
        </button>
      </div>
      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 520 }}>
          <h3 style={{ marginTop: 0 }}>New Patient</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First name</label>
                <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of birth</label>
                <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} placeholder="Optional" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} />
            </div>
            <div className="form-group">
              <label>Emergency contact</label>
              <input value={form.emergency_contact} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}
      {list.length === 0 ? (
        <div className="empty">No patients yet. Add one to get started.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>DOB</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.last_name}, {p.first_name}</td>
                  <td>{formatDate(p.date_of_birth)}</td>
                  <td>{p.phone || '—'}</td>
                  <td>{p.email || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
