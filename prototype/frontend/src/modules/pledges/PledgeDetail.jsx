import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPledge, updatePledgeStatus, deletePledge } from './pledgeService'
import { formatDate } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'

const STATUS_STYLES = {
  PENDING: 'badge-warning',
  IN_FULFILLMENT: 'badge-info',
  COMPLETED: 'badge-success',
  CANCELLED: 'badge-danger',
}

export default function PledgeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  const isAdmin = user?.role === 'UPAZILA_OFFICER'
  const isOfficer = user?.role === 'UPAZILA_OFFICER' || user?.role === 'NGO_WORKER'

  const [pledge, setPledge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPledge(id)
      .then(data => setPledge(data.pledge))
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleStatusChange(newStatus) {
    try {
      await updatePledgeStatus(id, newStatus)
      addToast('Status updated', 'success')
      const data = await getPledge(id)
      setPledge(data.pledge)
    } catch (err) {
      addToast(err.error || 'Status update failed', 'error')
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this pledge?')) return
    try {
      await deletePledge(id)
      addToast('Pledge deleted', 'success')
      navigate('/app/pledges')
    } catch (err) {
      addToast(err.error || 'Delete failed', 'error')
    }
  }

  function getNextStatus(current) {
    const transitions = { PENDING: 'IN_FULFILLMENT', IN_FULFILLMENT: 'COMPLETED', COMPLETED: null, CANCELLED: null }
    return transitions[current]
  }

  if (loading) return <Loading message="Loading pledge..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>
  if (!pledge) return <div className="page-section"><p>Pledge not found</p></div>

  return (
    <div style={{ maxWidth: '720px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Pledge Detail</h1>
          <p className="page-header-subtitle">Relief contribution from {pledge.source_name}</p>
        </div>
      </div>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div>
            <p className="input-label">Source</p>
            <p style={{ fontWeight: 500 }}>{pledge.source_name}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{pledge.source_type}</p>
          </div>
          <div>
            <p className="input-label">Status</p>
            <span className={`badge ${STATUS_STYLES[pledge.status] || 'badge-warning'}`} style={{ fontSize: '0.875rem' }}>{pledge.status}</span>
          </div>
          <div>
            <p className="input-label">Item Category</p>
            <p style={{ fontWeight: 500 }}>{pledge.itemCategoryId?.name || pledge.itemCategoryId}</p>
          </div>
          <div>
            <p className="input-label">Target Area</p>
            <p style={{ fontWeight: 500 }}>{pledge.areaId?.name || pledge.customArea || pledge.areaId || '—'}</p>
          </div>
          <div>
            <p className="input-label">Total Quantity</p>
            <p style={{ fontWeight: 600, fontSize: '1.2rem' }}>{pledge.total_qty}</p>
          </div>
          <div>
            <p className="input-label">Distributed So Far</p>
            <p style={{ fontWeight: 600, fontSize: '1.2rem' }}>{pledge.distributed_qty}</p>
          </div>
          <div>
            <p className="input-label">Remaining</p>
            <p style={{ fontWeight: 700, fontSize: '1.3rem', color: pledge.remaining_qty > 0 ? 'var(--color-primary)' : 'var(--color-success)' }}>
              {pledge.remaining_qty}
            </p>
          </div>
          <div>
            <p className="input-label">Pledge Date</p>
            <p>{formatDate(pledge.pledge_date)}</p>
          </div>
          {pledge.expected_delivery_date && (
            <div>
              <p className="input-label">Expected Delivery</p>
              <p>{formatDate(pledge.expected_delivery_date)}</p>
            </div>
          )}
          {pledge.fulfilled_date && (
            <div>
              <p className="input-label">Fulfilled Date</p>
              <p>{formatDate(pledge.fulfilled_date)}</p>
            </div>
          )}
        </div>

        {pledge.notes && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <p className="input-label">Notes</p>
            <p style={{ color: 'var(--color-text-secondary)' }}>{pledge.notes}</p>
          </div>
        )}

        <div className="page-actions" style={{ marginTop: 'var(--space-6)' }}>
          {(isOfficer || (user?.role === 'CITIZEN' && pledge.status === 'PENDING')) && getNextStatus(pledge.status) && (
            <Button onClick={() => handleStatusChange(getNextStatus(pledge.status))}>
              {getNextStatus(pledge.status) === 'IN_FULFILLMENT' ? 'Start Fulfillment' : getNextStatus(pledge.status) === 'COMPLETED' ? 'Mark Completed' : ''}
            </Button>
          )}
          {(pledge.status === 'PENDING' || pledge.status === 'IN_FULFILLMENT') && (
            <Button variant="secondary" onClick={() => handleStatusChange('CANCELLED')}>Cancel Pledge</Button>
          )}
          {isAdmin && <Button variant="danger" onClick={handleDelete}>Delete</Button>}
          <Button variant="ghost" onClick={() => navigate('/app/pledges')}>Back to List</Button>
        </div>
      </Card>
    </div>
  )
}
