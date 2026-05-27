import { useAuth } from '../../hooks/useAuth'
import { roleLabel } from '../../utils/formatters'
import SyncStatus from './SyncStatus'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-primary-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight">RelifMesh</h1>
        <span className="text-primary-200 text-xs hidden sm:inline">Disaster Relief Coordination</span>
      </div>
      <div className="flex items-center gap-4">
        <SyncStatus />
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-primary-200">{roleLabel(user.role)}</p>
            </div>
            <button onClick={logout} className="text-sm text-primary-200 hover:text-white transition-colors">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
