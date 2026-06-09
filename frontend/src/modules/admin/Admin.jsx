import { useState, useEffect } from 'react'
import { listAlerts, resolveAlert } from './adminService'
import { formatDateTime } from '../../utils/formatters'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Button from '../../components/common/Button'
import Input from '../../components/ui/Input'

export default function Admin() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolveId, setResolveId] = useState(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    listAlerts()
      .then(data => setAlerts(data.alerts))
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  async function handleResolve(id) {
    try {
      await resolveAlert(id, reason)
      setAlerts(a => a.filter(al => al._id !== id))
      setResolveId(null)
      setReason('')
    } catch (err) {
      setError(err.error || 'Failed to resolve')
    }
  }

  if (loading) return <Loading message="Loading admin..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>

  const unresolved = alerts.filter(a => !a.isResolved)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Admin</h1>
          <p className="page-header-subtitle">Duplicate alert management</p>
        </div>
      </div>
      <Card>
        <h2 className="page-section-title">Duplicate Alerts <span className="badge badge-warning">{unresolved.length}</span></h2>
        {unresolved.length === 0 ? (
          <p className="data-table-empty">No unresolved alerts.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {unresolved.map(alert => (
              <div key={alert._id} className="page-section" style={{ marginBottom: 0 }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Household: <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{alert.householdId?.headName || alert.householdId}</span>
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{formatDateTime(alert.createdAt)}</p>
                {resolveId === alert._id ? (
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        name="reason"
                        placeholder="Override reason..."
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => handleResolve(alert._id)} disabled={!reason}>Resolve</Button>
                    <Button variant="ghost" onClick={() => setResolveId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="secondary" size="sm" style={{ marginTop: 'var(--space-2)' }} onClick={() => setResolveId(alert._id)}>Resolve</Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
