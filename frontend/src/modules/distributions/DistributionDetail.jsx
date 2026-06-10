import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getDistribution, deleteDistribution } from './distributionService'
import { formatDateTime } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'

export default function DistributionDetail() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [log, setLog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const canEdit = user?.role === 'UP_OFFICIAL' || user?.role === 'NGO_WORKER'
  const canDelete = user?.role === 'UP_OFFICIAL' || user?.role === 'UPAZILA_OFFICER'

  useEffect(() => {
    getDistribution(id)
      .then(data => setLog(data.log))
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!confirm('Delete this distribution log? This cannot be undone.')) return
    setDeleting(true)
    try {
      await deleteDistribution(id)
      addToast('Distribution deleted', 'success')
      navigate('/distributions')
    } catch (err) {
      addToast(err.error || 'Failed to delete', 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loading message="Loading distribution..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>
  if (!log) return null

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Distribution Detail</h1>
          <p className="page-header-subtitle">Logged on {formatDateTime(log.createdAt)}</p>
        </div>
      </div>

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span className={`badge ${log.syncStatus === 'SYNCED' ? 'badge-success' : 'badge-warning'}`}>{log.syncStatus}</span>
          {log.isOverride && <span className="badge badge-warning">Override</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <p className="input-label">Household</p>
            <p style={{ fontWeight: 500 }}>{log.householdId?.headName || 'N/A'}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>NID: {log.householdId?.nid || 'N/A'}</p>
          </div>
          <div>
            <p className="input-label">Officer</p>
            <p style={{ fontWeight: 500 }}>{log.officerId?.name || 'N/A'}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{log.officerId?.email || ''}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <p className="input-label">Item</p>
            <p style={{ fontWeight: 500 }}>{log.itemCategoryId?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="input-label">Quantity</p>
            <p style={{ fontWeight: 500 }}>{log.quantity}</p>
          </div>
          <div>
            <p className="input-label">Unit</p>
            <p style={{ fontWeight: 500 }}>{log.unit}</p>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <p className="input-label">Distribution Date</p>
          <p style={{ fontWeight: 500 }}>{formatDateTime(log.distributedAt)}</p>
        </div>

        {log.gps && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <p className="input-label">GPS Location</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Lat: {log.gps.lat}, Lng: {log.gps.lng}
            </p>
          </div>
        )}

        {log.photoUrl && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <p className="input-label">Photo</p>
            <img src={log.photoUrl} alt="Distribution" style={{ maxWidth: '300px', borderRadius: 'var(--radius-sm)' }} />
          </div>
        )}

        {log.overrideReason && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <p className="input-label">Override Reason</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{log.overrideReason}</p>
          </div>
        )}
      </Card>

      <div className="page-actions">
        {canEdit && <Link to={`/distributions/${id}/edit`}><Button>Edit</Button></Link>}
        {canDelete && <Button variant="danger" onClick={handleDelete} loading={deleting} disabled={deleting}>Delete</Button>}
        <Button variant="secondary" onClick={() => navigate('/distributions')}>Back to List</Button>
      </div>
    </div>
  )
}
