import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRequest, cancelRequest } from './reliefRequestService'
import { formatDateTime } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'

const STATUS_COLORS = {
  PENDING: 'badge-warning',
  APPROVED: 'badge-success',
  REJECTED: 'badge-danger',
  FULFILLED: 'badge-info',
}

export default function ReliefRequestDetail() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    getRequest(id)
      .then(data => setRequest(data.request))
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this request?')) return
    setCancelling(true)
    try {
      const data = await cancelRequest(id)
      setRequest(data.request)
      addToast('Request cancelled', 'success')
    } catch (err) {
      addToast(err.error || 'Failed to cancel', 'error')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <Loading message="Loading request..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>
  if (!request) return null

  const isOwner = user?.sub === request.citizenId?._id || user?.sub === request.citizenId

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Relief Request</h1>
          <p className="page-header-subtitle">Submitted {formatDateTime(request.createdAt)}</p>
        </div>
      </div>

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span className={`badge ${STATUS_COLORS[request.status]}`} style={{ fontSize: '0.875rem', padding: '4px 12px' }}>{request.status}</span>
          {request.priority && (
            <span className={`badge ${request.priority === 'URGENT' || request.priority === 'HIGH' ? 'badge-danger' : 'badge-info'}`}>{request.priority}</span>
          )}
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <p className="input-label">Description</p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{request.description || 'No description provided'}</p>
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <p className="input-label">Requested Items</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {request.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontWeight: 500 }}>{item.itemCategoryId?.name || 'Item'}</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{item.quantity} {item.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {request.location?.address && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <p className="input-label">Location</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{request.location.address}</p>
          </div>
        )}

        {request.reviewedBy && (
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <p className="input-label">Review</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Reviewed by: {request.reviewedBy.name || request.reviewedBy.email} on {formatDateTime(request.reviewedAt)}
            </p>
            {request.reviewNotes && (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                Notes: {request.reviewNotes}
              </p>
            )}
          </div>
        )}
      </Card>

      <div className="page-actions">
        {isOwner && request.status === 'PENDING' && (
          <Button variant="danger" onClick={handleCancel} loading={cancelling} disabled={cancelling}>Cancel Request</Button>
        )}
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  )
}
