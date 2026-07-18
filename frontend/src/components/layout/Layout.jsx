import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ErrorBoundary from '../common/ErrorBoundary'

const THEME_KEY = 'reliefmesh-theme'

export default function Layout() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY)
    const theme = saved || 'light'
    document.documentElement.setAttribute('data-theme', theme)
    return theme === 'dark'
  })

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleTheme = useCallback(() => {
    const html = document.documentElement
    const next = isDark ? 'light' : 'dark'
    html.setAttribute('data-theme', next)
    localStorage.setItem(THEME_KEY, next)
    setIsDark(!isDark)
  }, [isDark])

  function closeMobileSidebar() {
    setIsMobileOpen(false)
  }

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        isMobileOpen={isMobileOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        onMobileClose={closeMobileSidebar}
      />
      <div className={`main-area main-area--with-sidebar${!sidebarOpen ? ' main-area--collapsed' : ''}`}>
        <Topbar
          onToggleMobile={() => setIsMobileOpen(o => !o)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
        <main className="page-content" id="main-content" onClick={closeMobileSidebar}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
