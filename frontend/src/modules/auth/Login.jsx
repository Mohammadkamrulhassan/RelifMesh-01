import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  const [showDemo, setShowDemo] = useState(false)

  if (user) {
    navigate(user.role === 'CITIZEN' ? '/app/relief-requests' : '/app/households', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const u = await login(email, password)
      navigate(u?.role === 'CITIZEN' ? '/app/relief-requests' : '/app/households')
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
            Relief<span className="auth-brand-accent">Mesh</span>
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
          <p className="auth-card-sub">Sign in to your ReliefMesh account</p>

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

          <p style={{ marginTop: '16px', fontSize: '0.85rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Register as Citizen</Link>
          </p>

          {showDemo ? (
            <div className="demo-credentials">
              <div className="demo-credentials-header">
                <p className="demo-credentials-title">Demo Credentials</p>
                <button type="button" className="demo-credentials-toggle" onClick={() => setShowDemo(false)}>Hide</button>
              </div>
              <table className="demo-credentials-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>upazila@reliefmesh.test</td>
                    <td>password123</td>
                    <td><span className="badge badge-info">UPAZILA_OFFICER</span></td>
                  </tr>
                  <tr>
                    <td>upofficial@reliefmesh.test</td>
                    <td>password123</td>
                    <td><span className="badge badge-primary">UP_OFFICIAL</span></td>
                  </tr>
                  <tr>
                    <td>ngo@reliefmesh.test</td>
                    <td>password123</td>
                    <td><span className="badge badge-success">NGO_WORKER</span></td>
                  </tr>
                  <tr>
                    <td>citizen@reliefmesh.test</td>
                    <td>password123</td>
                    <td><span className="badge badge-warning">CITIZEN</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                type="button"
                className="demo-credentials-toggle"
                onClick={() => setShowDemo(true)}
                style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '2px' }}
              >
                Show demo credentials
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
