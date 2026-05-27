import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import ErrorBoundary from '../common/ErrorBoundary'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
