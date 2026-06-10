import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ToastProvider } from './components/ui/Toast'
import Layout from './components/layout/Layout'
import Login from './modules/auth/Login'
import Register from './modules/auth/Register'
import Households from './modules/households/Households'
import HouseholdForm from './modules/households/HouseholdForm'
import HouseholdDetail from './modules/households/HouseholdDetail'
import Distributions from './modules/distributions/Distributions'
import DistributionForm from './modules/distributions/DistributionForm'
import DistributionDetail from './modules/distributions/DistributionDetail'
import PublicDashboard from './modules/dashboard/PublicDashboard'
import Dashboard from './modules/dashboard/Dashboard'
import Reports from './modules/reports/Reports'
import Admin from './modules/admin/Admin'
import Profile from './modules/profile/Profile'
import FeedbackForm from './modules/feedback/FeedbackForm'
import FeedbackList from './modules/feedback/FeedbackList'
import ReliefRequestList from './modules/reliefRequests/ReliefRequestList'
import ReliefRequestForm from './modules/reliefRequests/ReliefRequestForm'
import ReliefRequestDetail from './modules/reliefRequests/ReliefRequestDetail'
import ReliefRequestAdmin from './modules/reliefRequests/ReliefRequestAdmin'

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
      <Route path="/register" element={<Register />} />
      <Route path="/public" element={<PublicDashboard />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="households" element={<Households />} />
        <Route path="households/new" element={<HouseholdForm />} />
        <Route path="households/:id" element={<HouseholdDetail />} />
        <Route path="households/:id/edit" element={<HouseholdForm />} />
        <Route path="distributions" element={<Distributions />} />
        <Route path="distributions/new" element={<DistributionForm />} />
        <Route path="distributions/:id" element={<DistributionDetail />} />
        <Route path="distributions/:id/edit" element={<DistributionForm />} />
        <Route path="reports" element={<Reports />} />
        <Route path="admin" element={<Admin />} />
        <Route path="profile" element={<Profile />} />
        <Route path="feedback" element={<FeedbackForm />} />
        <Route path="feedback/manage" element={<FeedbackList />} />
        <Route path="relief-requests" element={<ReliefRequestList />} />
        <Route path="relief-requests/new" element={<ReliefRequestForm />} />
        <Route path="relief-requests/:id" element={<ReliefRequestDetail />} />
        <Route path="relief-requests/admin" element={<ReliefRequestAdmin />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}
