import { useState, useEffect } from 'react'
import { getDashboard, getMapData } from './dashboardService'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import MapView from '../../components/maps/MapView'

export default function PublicDashboard() {
  const [stats, setStats] = useState(null)
  const [mapData, setMapData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getDashboard(), getMapData()])
      .then(([dash, map]) => {
        setStats(dash)
        setMapData(map.data || [])
      })
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading message="Loading dashboard..." />
  if (error) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>{error}</p></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Dashboard</h1>
          <p className="page-header-subtitle">Disaster Relief Coordination Overview</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <Card className="text-center">
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{stats?.totalHouseholds || 0}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Households Registered</p>
        </Card>
        <Card className="text-center">
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{stats?.totalDistributions || 0}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Distributions Logged</p>
        </Card>
        <Card className="text-center">
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{stats?.unions?.length || 0}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Item Categories</p>
        </Card>
      </div>

      <Card>
        <h2 className="page-section-title">Distribution Map</h2>
        <MapView markers={mapData.map((d, i) => ({ lat: 22.6512 + (i % 5) * 0.008, lng: 92.1712 + Math.floor(i / 5) * 0.008, popup: `${d.count} distributions` }))} />
      </Card>
    </div>
  )
}
