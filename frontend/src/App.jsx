import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import Login from './modules/auth/Login'
import Households from './modules/households/Households'
import HouseholdForm from './modules/households/HouseholdForm'
import HouseholdDetail from './modules/households/HouseholdDetail'
import Distributions from './modules/distributions/Distributions'
import DistributionForm from './modules/distributions/DistributionForm'
import PublicDashboard from './modules/dashboard/PublicDashboard'
import Reports from './modules/reports/Reports'
import Admin from './modules/admin/Admin'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/public" element={<PublicDashboard />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/households" replace />} />
        <Route path="households" element={<Households />} />
        <Route path="households/new" element={<HouseholdForm />} />
        <Route path="households/:id" element={<HouseholdDetail />} />
        <Route path="households/:id/edit" element={<HouseholdForm />} />
        <Route path="distributions" element={<Distributions />} />
        <Route path="distributions/new" element={<DistributionForm />} />
        <Route path="reports" element={<Reports />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
