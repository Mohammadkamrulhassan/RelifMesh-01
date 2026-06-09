import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listHouseholds } from './householdService'
import { formatDate } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Pagination from '../../components/ui/Pagination'
import { useToast } from '../../components/ui/Toast'
import Input from '../../components/ui/Input'

export default function Households() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const canCreate = user?.role === 'UP_OFFICIAL' || user?.role === 'UPAZILA_OFFICER'
  const [households, setHouseholds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: '12' })
    if (search) params.set('q', search)
    listHouseholds(`?${params.toString()}`)
      .then(data => {
        setHouseholds(data.households)
        setTotalPages(data.pages || 1)
      })
      .catch(err => {
        setError(err.error || 'Failed to load')
        addToast('Failed to load households', 'error')
      })
      .finally(() => setLoading(false))
  }, [page, search])

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
  }

  if (loading) return <Loading message="Loading households..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Households</h1>
          <p className="page-header-subtitle">{households.length} registered household{households.length !== 1 ? 's' : ''}</p>
        </div>
        {canCreate && <Link to="/households/new"><Button leftIcon={<span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>}>Register Household</Button></Link>}
      </div>
      <form onSubmit={handleSearch} style={{ marginBottom: 'var(--space-4)', maxWidth: '360px' }}>
        <Input name="search" placeholder="Search by name or NID..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 0 }}
        />
      </form>
      {households.length === 0 ? (
        <Card><p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '32px 0' }}>No households registered yet.</p></Card>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {households.map(h => (
            <Link key={h._id || h.hhId} to={`/households/${h._id || h.hhId}`} style={{ textDecoration: 'none' }}>
              <Card className="page-section" style={{ cursor: 'pointer', transition: 'box-shadow var(--transition-base)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              >
                <h3 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 'var(--space-2)' }}>{h.headName}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>NID: {h.nid}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Family: {h.familySize}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Registered: {formatDate(h.createdAt)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <Pagination page={page} pages={totalPages} onPageChange={setPage} />
    </div>
  )
}
