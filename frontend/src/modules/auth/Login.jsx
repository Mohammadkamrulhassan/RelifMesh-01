import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
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
    <div className="auth-layout">
      <div className="auth-brand-panel" aria-hidden="true">
        <div>
          <p className="auth-brand-logo">
            Relif<span className="auth-brand-accent">Mesh</span>
          </p>
          <p className="auth-brand-tagline">
            Disaster relief coordination system with{' '}
            <span className="auth-brand-accent">offline-first sync</span>
            {' '}— ensuring every distribution is tracked, even in the field.
          </p>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <h1 className="auth-card-title">Welcome back</h1>
          <p className="auth-card-sub">Sign in to your RelifMesh account</p>

          {error && (
            <div style={{ marginBottom: '20px' }}>
              <div className="badge badge-danger" style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', width: '100%', fontSize: '0.8rem' }}>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Login form">
            <div style={{ marginBottom: '16px' }}>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={submitting}
                required
                autoComplete="username"
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={submitting}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" variant="primary" size="md" fullWidth loading={submitting} disabled={submitting || !email || !password}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p style={{ marginTop: '24px', fontSize: '0.75rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Test: upazila@relifmesh.test / upofficial@relifmesh.test / ngo@relifmesh.test
          </p>
        </div>
      </div>
    </div>
  )
}
