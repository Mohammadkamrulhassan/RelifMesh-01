import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listMyRequests } from './reliefRequestService'
import { formatDateTime } from '../../utils/formatters'
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

export default function ReliefRequestList() {
  const { addToast } = useToast()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: '20' })
    if (search) params.set('q', search)
    if (statusFilter) params.set('status', statusFilter)
    listMyRequests(`?${params.toString()}`)
      .then(data => {
        setRequests(data.requests)
        setTotalPages(data.pages || 1)
      })
      .catch(err => addToast(err.error || 'Failed to load', 'error'))
      .finally(() => setLoading(false))
  }, [page, search, statusFilter])

  if (loading) return <Loading message="Loading requests..." />

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">My Relief Requests</h1>
          <p className="page-header-subtitle">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/app/relief-requests/new"><Button leftIcon={<span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>}>New Request</Button></Link>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Input name="search" placeholder="Search requests..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ minWidth: '140px' }}>
          <SelectField label="" name="statusFilter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="FULFILLED">Fulfilled</option>
          </SelectField>
        </div>
      </div>
      {requests.length === 0 ? (
        <Card><p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px 0' }}>No relief requests yet.</p></Card>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {requests.map(r => (
            <Link key={r._id} to={`/app/relief-requests/${r._id}`} style={{ textDecoration: 'none' }}>
              <Card className="page-section" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                  <span className={`badge ${STATUS_COLORS[r.status] || 'badge-warning'}`}>{r.status}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDateTime(r.createdAt)}</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  {r.description || 'No description'}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {r.items?.map((item, i) => (
                    <span key={i} className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                      {item.quantity} {item.unit} {item.itemCategoryId?.name || ''}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <Pagination page={page} pages={totalPages} onPageChange={setPage} />
    </div>
  )
}
