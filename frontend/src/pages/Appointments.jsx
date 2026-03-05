import { useState, useEffect } from 'react'
import { appointments as appointmentsApi, doctors as doctorsApi, patients as patientsApi } from '../api/client'

function formatDateTime(s) {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleString()
  } catch {
    return s
  }
}

const statusClass = (s) => (s ? `badge badge-${s}` : 'badge')

export default function Appointments() {
  const [list, setList] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    patient: '', doctor: '', scheduled_at: '', status: 'scheduled', notes: '',
  })

  const load = () => {
    Promise.all([appointmentsApi.list(), doctorsApi.list(), patientsApi.list()])
      .then(([a, d, p]) => {
        setList(a.data.results ?? a.data)
        setDoctors(d.data.results ?? d.data)
        setPatients(p.data.results ?? p.data)
      })
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      patient: Number(form.patient),
      doctor: Number(form.doctor),
      scheduled_at: form.scheduled_at,
      status: form.status,
      notes: form.notes || '',
    }
    appointmentsApi.create(payload)
      .then(() => {
        setShowForm(false)
        setForm({ patient: '', doctor: '', scheduled_at: '', status: 'scheduled', notes: '' })
        load()
      })
      .catch((err) => setError(err.response?.data ? JSON.stringify(err.response.data) : err.message))
  }

  if (loading) return <div className="app-page"><div className="loading">Loading…</div></div>

  return (
    <div className="app-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Appointments</h1>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Appointment'}
        </button>
      </div>
      {error && <div className="error" style={{ marginBottom: '1rem' }}>{error}</div>}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 480 }}>
          <h3 style={{ marginTop: 0 }}>New Appointment</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Patient</label>
              <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.last_name}, {p.first_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Doctor</label>
              <select value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
                <option value="">Select doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>Dr. {d.last_name}, {d.first_name} ({d.specialty})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date & time</label>
              <input
                type="datetime-local"
                value={form.scheduled_at}
                onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}
      {list.length === 0 ? (
        <div className="empty">No appointments yet. Add patients and doctors first, then create an appointment.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient_name}</td>
                  <td>{a.doctor_name}</td>
                  <td>{formatDateTime(a.scheduled_at)}</td>
                  <td><span className={statusClass(a.status)}>{a.status}</span></td>
                  <td className="muted">{a.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
