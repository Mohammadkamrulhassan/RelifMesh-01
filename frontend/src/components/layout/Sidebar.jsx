import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getNavItems } from '../../constants/navItems'
import { Icon } from '../ui/Icon'

export default function Sidebar({ isOpen, isMobileOpen, onToggle, onMobileClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navItems = getNavItems(user?.role)

  return (
    <>
      {isMobileOpen && <div className="sidebar-mobile-overlay" onClick={onMobileClose} aria-hidden="true" />}
      <aside
        className={[
          'sidebar',
          !isOpen ? 'sidebar--collapsed' : '',
          isMobileOpen ? 'sidebar--mobile-open' : '',
        ].filter(Boolean).join(' ')}
        aria-label="Sidebar"
      >
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark" aria-hidden="true">R</div>
          <span className="sidebar-logo-text">RelifMesh</span>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map(section => (
            <div key={section.section} className="sidebar-section">
              <p className="sidebar-section-label" aria-hidden={!isOpen}>{section.section}</p>
              {section.items.map(item => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'))
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    className={`sidebar-item ${isActive ? 'sidebar-item--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="sidebar-icon"><Icon name={item.icon} /></span>
                    <span className="sidebar-item-label">{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item sidebar-item--logout" onClick={logout} title="Logout">
            <span className="sidebar-icon"><Icon name="logout" /></span>
            <span className="sidebar-item-label">Logout</span>
          </button>
        </div>

        <button className="sidebar-toggle-btn" onClick={onToggle} aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
          <Icon name={isOpen ? 'chevronLeft' : 'chevronRight'} />
          <span className="sidebar-item-label">{isOpen ? 'Collapse' : ''}</span>
        </button>
      </aside>
    </>
  )
}
