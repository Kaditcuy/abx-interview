import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import './Dashboard.css'

export default function Dashboard() {
  const [counts, setCounts] = useState({ departments: 0, doctors: 0, patients: 0, appointments: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [d, doc, p, a] = await Promise.all([
          api.get('/departments/'),
          api.get('/doctors/'),
          api.get('/patients/'),
          api.get('/appointments/'),
        ])
        setCounts({
          departments: d.data.count ?? d.data.results?.length ?? 0,
          doctors: doc.data.count ?? doc.data.results?.length ?? 0,
          patients: p.data.count ?? p.data.results?.length ?? 0,
          appointments: a.data.count ?? a.data.results?.length ?? 0,
        })
      } catch (e) {
        setError(e.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div className="app-page dashboard-page"><div className="loading">Loading…</div></div>
  if (error) return <div className="app-page dashboard-page"><div className="error">{error}</div></div>

  const cards = [
    { label: 'Departments', value: counts.departments, to: '/departments' },
    { label: 'Doctors', value: counts.doctors, to: '/doctors' },
    { label: 'Patients', value: counts.patients, to: '/patients' },
    { label: 'Appointments', value: counts.appointments, to: '/appointments' },
  ]

  return (
    <div className="app-page dashboard-page">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        {cards.map(({ label, value, to }) => (
          <Link key={to} to={to} className="dashboard-card">
            <span className="dashboard-value">{value}</span>
            <span className="dashboard-label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
