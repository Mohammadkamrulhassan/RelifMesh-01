import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getHousehold } from './householdService'
import { listDistributions } from '../distributions/distributionService'
import { formatDateTime } from '../../utils/formatters'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Button from '../../components/common/Button'
import MapView from '../../components/maps/MapView'

export default function HouseholdDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [household, setHousehold] = useState(null)
  const [distributions, setDistributions] = useState([])
  const [distsLoading, setDistsLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getHousehold(id)
      .then(({ household }) => setHousehold(household))
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
    listDistributions({ householdId: id, limit: '50' })
      .then(data => setDistributions(data.logs || []))
      .catch(() => {})
      .finally(() => setDistsLoading(false))
  }, [id])

  if (loading) return <Loading message="Loading household..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>
  if (!household) return <div className="page-section"><p style={{ color: 'var(--color-text-muted)' }}>Household not found</p></div>

  const markers = household.gps?.lat ? [{ lat: household.gps.lat, lng: household.gps.lng, popup: household.headName }] : []

  return (
    <div style={{ maxWidth: '720px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">{household.headName}</h1>
          <p className="page-header-subtitle">Household Details</p>
        </div>
        <div className="page-actions">
          <Link to={`/households/${id}/edit`}><Button variant="secondary">Edit</Button></Link>
          <Button variant="ghost" onClick={() => navigate('/households')}>Back</Button>
        </div>
      </div>

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div><p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>NID</p><p style={{ fontWeight: 500 }}>{household.nid}</p></div>
          <div><p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>Family Size</p><p style={{ fontWeight: 500 }}>{household.familySize}</p></div>
          <div><p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>GPS</p><p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{household.gps ? `${household.gps.lat}, ${household.gps.lng}` : 'Not set'}</p></div>
          <div><p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>Registered</p><p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{formatDateTime(household.createdAt)}</p></div>
        </div>
      </Card>

      {household.familyMembers?.length > 0 && (
        <Card style={{ marginBottom: 'var(--space-4)' }}>
          <h2 className="page-section-title">Family Members ({household.familyMembers.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {household.familyMembers.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: i < household.familyMembers.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <div>
                  <p style={{ fontWeight: 500 }}>{m.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Age: {m.age}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{m.idType}</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{m.idNumber}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="page-section-title">Vulnerability Flags</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['elderly', 'disabled', 'pregnant'].map(f => (
            <span key={f} className={`badge ${household.vulnerabilityFlags?.[f] ? 'badge-danger' : 'badge-neutral'}`}>
              {f}
            </span>
          ))}
        </div>
      </Card>

      {household.photoUrl && (
        <Card style={{ marginBottom: 'var(--space-4)' }}>
          <h2 className="page-section-title">Photo</h2>
          <img src={household.photoUrl} alt="Household" style={{ maxWidth: '320px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
        </Card>
      )}

      <Card style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="page-section-title">
          Relief Received
          {!distsLoading && <span className="badge badge-info" style={{ marginLeft: 'var(--space-2)' }}>{distributions.length}</span>}
        </h2>
        {distsLoading ? (
          <Loading message="Loading relief history..." />
        ) : distributions.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No relief distributed to this household yet.</p>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Date</th>
                  <th>Officer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {distributions.map(d => (
                  <tr key={d._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/distributions/${d._id}`)}>
                    <td style={{ fontWeight: 500 }}>{d.itemCategoryId?.name || d.unit}</td>
                    <td>{d.quantity} {d.unit}</td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{formatDateTime(d.distributedAt)}</td>
                    <td style={{ fontSize: '0.85rem' }}>{d.officerId?.name || '—'}</td>
                    <td>
                      <span className={`badge ${d.syncStatus === 'SYNCED' ? 'badge-success' : 'badge-warning'}`}>{d.syncStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {markers.length > 0 && (
        <Card>
          <h2 className="page-section-title">Location</h2>
          <MapView markers={markers} center={[household.gps.lat, household.gps.lng]} zoom={15} />
        </Card>
      )}
    </div>
  )
}
