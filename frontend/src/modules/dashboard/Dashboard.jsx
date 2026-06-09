import { useState, useEffect } from 'react'
import { getDashboard, getMapData } from './dashboardService'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import MapView from '../../components/maps/MapView'
import { useToast } from '../../components/ui/Toast'

export default function Dashboard() {
  const { addToast } = useToast()
  const [stats, setStats] = useState(null)
  const [mapData, setMapData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboard(), getMapData()])
      .then(([dash, map]) => {
        setStats(dash)
        setMapData(map.data || [])
      })
      .catch(err => addToast(err.error || 'Failed to load dashboard', 'error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading message="Loading dashboard..." />
  if (!stats) return <div className="page-section"><p style={{ color: 'var(--color-danger)' }}>Dashboard unavailable</p></div>

  const cards = [
    { label: 'Households Registered', value: stats.totalHouseholds, color: 'var(--color-primary)' },
    { label: 'Distributions Logged', value: stats.totalDistributions, color: 'var(--color-success)' },
    { label: 'Item Categories', value: stats.totalCategories ?? stats.unions?.length ?? 0, color: 'var(--color-info)' },
    { label: 'Unresolved Alerts', value: stats.unresolvedAlerts, color: stats.unresolvedAlerts > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' },
    { label: 'Feedback Received', value: stats.totalFeedbacks ?? 0, color: 'var(--color-accent)' },
    { label: 'Pending Sync', value: stats.pendingSync ?? 0, color: stats.pendingSync > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Dashboard</h1>
          <p className="page-header-subtitle">Disaster Relief Coordination Overview</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        {cards.map(c => (
          <Card key={c.label} className="text-center">
            <p style={{ fontSize: '2rem', fontWeight: 700, color: c.color }}>{c.value ?? 0}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>{c.label}</p>
          </Card>
        ))}
      </div>

      {stats.recentDistributions?.length > 0 && (
        <Card style={{ marginBottom: 'var(--space-4)' }}>
          <h2 className="page-section-title">Recent Distributions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {stats.recentDistributions.slice(0, 5).map(d => (
              <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '4px 0' }}>
                <span style={{ fontWeight: 500 }}>{d.householdId?.headName || d.householdId}</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{d.quantity} × {d.itemCategoryId?.name || d.unit}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="page-section-title">Distribution Map</h2>
        <MapView markers={mapData.map((d, i) => ({ lat: 22.6512 + (i % 5) * 0.008, lng: 92.1712 + Math.floor(i / 5) * 0.008, popup: `${d.count} distributions` }))} />
      </Card>
    </div>
  )
}
