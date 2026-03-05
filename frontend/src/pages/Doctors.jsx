import { useState, useEffect } from 'react'
import { doctors as doctorsApi, departments as departmentsApi } from '../api/client'

export default function Doctors() {
  const [list, setList] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    first_name: '', last_name: '', specialty: '', department: '', license_number: '', email: '',
  })

  const load = () => {
    Promise.all([doctorsApi.list({ include_inactive: 1 }), departmentsApi.list()])
      .then(([dr, dept]) => {
        setList(dr.data.results ?? dr.data)
        setDepartments(dept.data.results ?? dept.data)
      })
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      department: form.department || null,
    }
    doctorsApi.create(payload)
      .then(() => {
        setShowForm(false)
        setForm({ first_name: '', last_name: '', specialty: '', department: '', license_number: '', email: '' })
        load()
      })
      .catch((err) => setError(err.response?.data ? JSON.stringify(err.response.data) : err.message))
  }

  if (loading) return <div className="app-page"><div className="loading">Loading…</div></div>

  return (
    <div className="app-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Doctors</h1>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>
      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 480 }}>
          <h3 style={{ marginTop: 0 }}>New Doctor</h3>
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
            <div className="form-group">
              <label>Specialty</label>
              <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                <option value="">—</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>License number</label>
                <input value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}
      {list.length === 0 ? (
        <div className="empty">No doctors yet. Add one or create departments first.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>Email</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id}>
                  <td>Dr. {d.last_name}, {d.first_name}</td>
                  <td>{d.specialty}</td>
                  <td>{d.department_name || '—'}</td>
                  <td>{d.email || '—'}</td>
                  <td>{d.is_active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
