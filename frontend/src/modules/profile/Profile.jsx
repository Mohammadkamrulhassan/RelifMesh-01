import { useState, useEffect } from 'react'
import { get, put } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'
import Input from '../../components/ui/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import { roleLabel } from '../../utils/formatters'

export default function Profile() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', organization: '' })

  useEffect(() => {
    get('/auth/profile')
      .then(({ user: u }) => {
        setProfile(u)
        setForm({ name: u.name, organization: u.organization || '' })
      })
      .catch(() => addToast('Failed to load profile', 'error'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { user: updated } = await put('/auth/profile', form)
      setProfile(updated)
      addToast('Profile updated successfully', 'success')
    } catch {
      addToast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading message="Loading profile..." />
  if (!profile) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>Profile not found</p></div>

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">My Profile</h1>
          <p className="page-header-subtitle">{roleLabel(profile.role)}</p>
        </div>
      </div>

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="page-section-title">Account Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>Email</p>
            <p style={{ fontWeight: 500 }}>{profile.email}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>Role</p>
            <p style={{ fontWeight: 500 }}>{roleLabel(profile.role)}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>Organization</p>
            <p style={{ fontWeight: 500 }}>{profile.organization || 'N/A'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>Account Active</p>
            <p style={{ fontWeight: 500 }}>{profile.isActive ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="page-section-title">Edit Profile</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Full Name" name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Organization" name="organization" value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} />
          <div className="page-actions" style={{ justifyContent: 'flex-start' }}>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
