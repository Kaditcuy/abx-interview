import { NavLink } from 'react-router-dom'
import './Layout.css'

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/departments', label: 'Departments' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/patients', label: 'Patients' },
  { to: '/appointments', label: 'Appointments' },
]

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-brand">
          <span className="layout-logo">H</span>
          <span>Hospital System</span>
        </div>
        <nav className="layout-nav">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `layout-nav-link ${isActive ? 'active' : ''}`}
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}
