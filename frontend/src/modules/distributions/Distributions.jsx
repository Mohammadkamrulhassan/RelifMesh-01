import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listDistributions, deleteDistribution } from './distributionService'
import { formatDateTime } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/ui/Pagination'
import Input from '../../components/ui/Input'
import SelectField from '../../components/forms/SelectField'

export default function Distributions() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const canCreate = user?.role === 'UP_OFFICIAL' || user?.role === 'NGO_WORKER'
  const canEdit = user?.role === 'UP_OFFICIAL' || user?.role === 'NGO_WORKER'
  const canDelete = user?.role === 'UP_OFFICIAL' || user?.role === 'UPAZILA_OFFICER'
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleting, setDeleting] = useState(null)

  function loadData() {
    setLoading(true)
    const filters = { page, limit: '20' }
    if (search) filters.q = search
    if (statusFilter) filters.syncStatus = statusFilter
    listDistributions(filters)
      .then(data => {
        setLogs(data.logs)
        setTotalPages(data.pages || 1)
      })
      .catch(err => {
        setError(err.error || 'Failed to load')
        addToast('Failed to load distributions', 'error')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [page, search, statusFilter])

  async function handleDelete(id) {
    if (!confirm('Delete this distribution log? This cannot be undone.')) return
    setDeleting(id)
    try {
      await deleteDistribution(id)
      addToast('Distribution deleted', 'success')
      loadData()
    } catch (err) {
      addToast(err.error || 'Failed to delete', 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <Loading message="Loading distributions..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Distributions</h1>
          <p className="page-header-subtitle">{logs.length} log{logs.length !== 1 ? 's' : ''} recorded</p>
        </div>
        {canCreate && <Link to="/app/distributions/new"><Button leftIcon={<span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>}>Log Distribution</Button></Link>}
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Input name="search" placeholder="Search by household or item..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ minWidth: '140px' }}>
          <SelectField label="" name="statusFilter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">All Status</option>
            <option value="SYNCED">Synced</option>
            <option value="PENDING">Pending</option>
          </SelectField>
        </div>
      </div>
      {logs.length === 0 ? (
        <Card><p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px 0' }}>No distributions recorded yet.</p></Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Household</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Date</th>
                  <th>Status</th>
                  {(canEdit || canDelete) && <th style={{ width: '100px' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/distributions/${log._id}`)}>
                    <td style={{ fontWeight: 500 }}>{log.householdId?.headName || log.householdId?._id?.slice(-6) || '—'}</td>
                    <td>{log.itemCategoryId?.name || log.unit}</td>
                    <td>{log.quantity}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{formatDateTime(log.distributedAt)}</td>
                    <td>
                      <span className={`badge ${log.syncStatus === 'SYNCED' ? 'badge-success' : 'badge-warning'}`}>
                        {log.syncStatus}
                      </span>
                    </td>
                    {(canEdit || canDelete) && (
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                          {canEdit && (
                            <Button size="xs" variant="ghost" onClick={() => navigate(`/app/distributions/${log._id}/edit`)}>
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button size="xs" variant="danger" onClick={() => handleDelete(log._id)} loading={deleting === log._id} disabled={deleting === log._id}>
                              Del
                            </Button>
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
