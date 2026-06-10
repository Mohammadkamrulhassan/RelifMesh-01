import { useState, useEffect } from 'react'
import { listAllRequests, reviewRequest } from './reliefRequestService'
import { formatDateTime } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/ui/Pagination'
import Input from '../../components/ui/Input'
import SelectField from '../../components/forms/SelectField'

const STATUS_COLORS = {
  PENDING: 'badge-warning',
  APPROVED: 'badge-success',
  REJECTED: 'badge-danger',
  FULFILLED: 'badge-info',
}

export default function ReliefRequestAdmin() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const canReview = user?.role === 'UPAZILA_OFFICER' || user?.role === 'UP_OFFICIAL'
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [reviewing, setReviewing] = useState(null)
  const [reviewForm, setReviewForm] = useState({ status: 'APPROVED', reviewNotes: '' })

  function loadRequests() {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: '20' })
    if (statusFilter) params.set('status', statusFilter)
    if (priorityFilter) params.set('priority', priorityFilter)
    listAllRequests(`?${params.toString()}`)
      .then(data => {
        setRequests(data.requests)
        setTotalPages(data.pages || 1)
      })
      .catch(err => addToast(err.error || 'Failed to load', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadRequests() }, [page, statusFilter, priorityFilter])

  async function handleReview(requestId) {
    try {
      await reviewRequest(requestId, reviewForm)
      addToast('Request updated', 'success')
      setReviewing(null)
      setReviewForm({ status: 'APPROVED', reviewNotes: '' })
      loadRequests()
    } catch (err) {
      addToast(err.error || 'Failed to update', 'error')
    }
  }

  if (loading && requests.length === 0) return <Loading message="Loading relief requests..." />

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Relief Requests</h1>
          <p className="page-header-subtitle">Manage citizen relief requests</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ minWidth: '140px' }}>
          <SelectField label="" name="statusFilter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="FULFILLED">Fulfilled</option>
          </SelectField>
        </div>
        <div style={{ minWidth: '140px' }}>
          <SelectField label="" name="priorityFilter" value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1) }}>
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </SelectField>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card><p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px 0' }}>No requests found.</p></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {requests.map(r => (
            <Card key={r._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                <div>
                  <span className={`badge ${STATUS_COLORS[r.status]}`} style={{ marginRight: 'var(--space-2)' }}>{r.status}</span>
                  <span className={`badge ${r.priority === 'URGENT' || r.priority === 'HIGH' ? 'badge-danger' : 'badge-info'}`}>{r.priority}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDateTime(r.createdAt)}</span>
              </div>

              <div style={{ marginBottom: 'var(--space-2)' }}>
                <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                  {r.citizenId?.name || 'Unknown'} ({r.citizenId?.email || 'N/A'})
                </p>
                {r.citizenId?.phone && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Phone: {r.citizenId.phone}</p>}
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                {r.description || 'No description'}
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                {r.items?.map((item, i) => (
                  <span key={i} className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                    {item.quantity} {item.unit} {item.itemCategoryId?.name || ''}
                  </span>
                ))}
              </div>

              {r.location?.address && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                  Location: {r.location.address}
                </p>
              )}

              {canReview && r.status === 'PENDING' && (
                <div>
                  {reviewing === r._id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                      <SelectField label="Decision" name="status" value={reviewForm.status} onChange={e => setReviewForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="APPROVED">Approve</option>
                        <option value="REJECTED">Reject</option>
                      </SelectField>
                      <Input label="Notes (optional)" name="reviewNotes" value={reviewForm.reviewNotes} onChange={e => setReviewForm(f => ({ ...f, reviewNotes: e.target.value }))} />
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Button size="sm" onClick={() => handleReview(r._id)}>Submit</Button>
                        <Button size="sm" variant="secondary" onClick={() => { setReviewing(null); setReviewForm({ status: 'APPROVED', reviewNotes: '' }) }}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => setReviewing(r._id)}>Review</Button>
                  )}
                </div>
              )}

              {r.reviewNotes && r.status !== 'PENDING' && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-2)' }}>
                  Review notes: {r.reviewNotes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      <Pagination page={page} pages={totalPages} onPageChange={setPage} />
    </div>
  )
}
