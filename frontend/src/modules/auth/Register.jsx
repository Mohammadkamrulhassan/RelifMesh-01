import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { post } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/common/Button'

export default function Register() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { token, user } = await post('/auth/register/citizen', form)
      setAuth(user, token)
      navigate('/relief-requests')
    } catch (err) {
      setError(err.error || 'Registration failed')
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
            Register as a citizen to request disaster relief assistance.
          </p>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <h1 className="auth-card-title">Create Account</h1>
          <p className="auth-card-sub">Register as a citizen to request relief</p>

          {error && (
            <div style={{ marginBottom: '20px' }}>
              <div className="badge badge-danger" style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', width: '100%', fontSize: '0.8rem' }}>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '16px' }}>
              <Input label="Full Name" name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} required disabled={submitting} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Input label="Email" name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required disabled={submitting} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Input label="Password" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required disabled={submitting} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Input label="Phone" name="phone" type="tel" placeholder="Phone number" value={form.phone} onChange={handleChange} disabled={submitting} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <Input label="Address" name="address" placeholder="Village, union, upazila" value={form.address} onChange={handleChange} disabled={submitting} />
            </div>
            <Button type="submit" variant="primary" size="md" fullWidth loading={submitting} disabled={submitting || !form.name || !form.email || !form.password}>
              {submitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p style={{ marginTop: '24px', fontSize: '0.85rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
