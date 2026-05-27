import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/households', label: 'Households', roles: ['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER'] },
  { to: '/distributions', label: 'Distributions', roles: ['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER'] },
  { to: '/reports', label: 'Reports', roles: ['UPAZILA_OFFICER'] },
  { to: '/admin', label: 'Admin', roles: ['UPAZILA_OFFICER'] },
]

export default function Sidebar() {
  const { user } = useAuth()

  const visible = links.filter(l => l.roles.includes(user?.role))

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen pt-4 hidden md:block">
      <nav className="space-y-1 px-3">
        {visible.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
