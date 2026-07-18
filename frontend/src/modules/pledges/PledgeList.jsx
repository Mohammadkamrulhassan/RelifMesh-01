import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listPledges, updatePledgeStatus, deletePledge } from './pledgeService'
import { formatDate } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/ui/Pagination'
import Input from '../../components/ui/Input'
import SelectField from '../../components/forms/SelectField'

const STATUS_STYLES = {
  PENDING: 'badge-warning',
  IN_FULFILLMENT: 'badge-info',
  COMPLETED: 'badge-success',
  CANCELLED: 'badge-danger',
}

export default function PledgeList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const isOfficer = user?.role === 'UPAZILA_OFFICER' || user?.role === 'NGO_WORKER'
  const isAdmin = user?.role === 'UPAZILA_OFFICER'

  const [pledges, setPledges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  function loadData() {
    setLoading(true)
    const params = { page, limit: '20' }
    if (statusFilter) params.status = statusFilter
    if (search) params.q = search
    listPledges(params)
      .then(data => {
        setPledges(data.pledges)
        setTotalPages(data.pages || 1)
      })
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [page, statusFilter])

  async function handleStatusChange(id, newStatus) {
    setActionLoading(id)
    try {
      await updatePledgeStatus(id, newStatus)
      addToast(`Status updated to ${newStatus}`, 'success')
      loadData()
    } catch (err) {
      addToast(err.error || 'Status update failed', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this pledge?')) return
    setActionLoading(id)
    try {
      await deletePledge(id)
      addToast('Pledge deleted', 'success')
      loadData()
    } catch (err) {
      addToast(err.error || 'Delete failed', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  function getNextStatus(current) {
    const transitions = { PENDING: 'IN_FULFILLMENT', IN_FULFILLMENT: 'COMPLETED', COMPLETED: null, CANCELLED: null }
    return transitions[current]
  }

  if (loading) return <Loading message="Loading pledges..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Relief Pledges</h1>
          <p className="page-header-subtitle">{pledges.length} pledge{pledges.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <Link to="/app/pledges/new"><Button leftIcon={<span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>}>New Pledge</Button></Link>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Input name="search" placeholder="Search pledges..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ minWidth: '160px' }}>
          <SelectField label="" name="statusFilter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_FULFILLMENT">In Fulfillment</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </SelectField>
        </div>
      </div>

      {pledges.length === 0 ? (
        <Card><p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px 0' }}>No pledges yet.</p></Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Item</th>
                  <th>Total Qty</th>
                  <th>Distributed</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Date</th>
                  {(isOfficer || isAdmin) && <th style={{ width: '140px' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {pledges.map(p => (
                  <tr key={p._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/pledges/${p._id}`)}>
                    <td style={{ fontWeight: 500 }}>{p.source_name}<br /><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{p.source_type}</span></td>
                    <td>{p.itemCategoryId?.name || p.itemCategoryId}</td>
                    <td>{p.total_qty}</td>
                    <td>{p.distributed_qty}</td>
                    <td style={{ fontWeight: 600 }}>{p.remaining_qty}</td>
                    <td>
                      <span className={`badge ${STATUS_STYLES[p.status] || 'badge-warning'}`}>{p.status}</span>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(p.pledge_date)}</td>
                    {(isOfficer || isAdmin) && (
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                          {getNextStatus(p.status) && (
                            <Button size="xs" variant="ghost" onClick={() => handleStatusChange(p._id, getNextStatus(p.status))} loading={actionLoading === p._id}>
                              {getNextStatus(p.status) === 'IN_FULFILLMENT' ? 'Fulfill' : getNextStatus(p.status) === 'COMPLETED' ? 'Complete' : ''}
                            </Button>
                          )}
                          {isAdmin && (
                            <Button size="xs" variant="danger" onClick={() => handleDelete(p._id)}>Del</Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Pagination page={page} pages={totalPages} onPageChange={setPage} />
    </div>
  )
}
