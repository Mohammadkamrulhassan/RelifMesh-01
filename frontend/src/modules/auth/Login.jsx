import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import InputField from '../../components/forms/InputField'
import Button from '../../components/common/Button'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    navigate('/households', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/households')
    } catch (err) {
      setError(err.error || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800">RelifMesh</h1>
          <p className="text-gray-500 mt-1">Disaster Relief Coordination System</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Sign In</h2>
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>}
          <InputField label="Email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <InputField label="Password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" disabled={submitting} className="w-full">{submitting ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          Test: upazila@relifmesh.test / upofficial@relifmesh.test / ngo@relifmesh.test
        </p>
      </div>
    </div>
  )
}
