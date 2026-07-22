import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { roleLabel } from '../../utils/formatters'
import SyncStatus from './SyncStatus'
import { Icon } from '../ui/Icon'
import { useState, useEffect } from 'react'

const labelMap = {
  households: 'Households', distributions: 'Distributions',
  reports: 'Reports', admin: 'Admin', public: 'Public',
  new: 'New', edit: 'Edit',
}

function segmentLabel(seg) {
  return labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)
}

export default function Topbar({ onToggleMobile, isDark, onToggleTheme }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  return (
    <header className={`topbar ${'topbar--default'}`} role="banner">
      <button className="topbar-hamburger" onClick={onToggleMobile} aria-label="Open sidebar">
        <Icon name="menu" size={20} />
      </button>

      <nav className="topbar-breadcrumb" aria-label="Breadcrumb">
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1
          const label = segmentLabel(seg)
          const path = '/' + segments.slice(0, i + 1).join('/')
          if (isLast) {
            return <span key={`${seg}-${i}`} className="topbar-breadcrumb-current" aria-current="page">{label}</span>
          }
          return (
            <span key={`${seg}-${i}`} className="topbar-breadcrumb-item">
              <Link to={path}>{label}</Link>
              <span className="topbar-breadcrumb-sep" aria-hidden="true"> / </span>
            </span>
          )
        })}
      </nav>

      <div className="topbar-actions">
        <SyncStatus />
        <button className="topbar-icon-btn" onClick={onToggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
          {isDark ? <Icon name="sun" /> : <Icon name="moon" />}
        </button>
        {user && (
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="text-right">
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{user.name}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{roleLabel(user.role)}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
