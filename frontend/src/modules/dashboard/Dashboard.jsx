import { useState, useEffect } from 'react'
import { getDashboard, getMapData, getDistributionHeatmap } from './dashboardService'
import { getNeedHeatmap } from '../needs/needService'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import MapView from '../../components/maps/MapView'
import HeatmapLayer from '../../components/maps/HeatmapLayer'
import { useToast } from '../../components/ui/Toast'

export default function Dashboard() {
  const { addToast } = useToast()
  const [stats, setStats] = useState(null)
  const [mapData, setMapData] = useState([])
  const [needPoints, setNeedPoints] = useState([])
  const [distPoints, setDistPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNeedHeat, setShowNeedHeat] = useState(false)
  const [showDistHeat, setShowDistHeat] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)

  useEffect(() => {
    Promise.all([getDashboard(), getMapData(), getNeedHeatmap(), getDistributionHeatmap()])
      .then(([dash, map, needHeat, distHeat]) => {
        setStats(dash)
        setMapData(map.data || [])
        setNeedPoints(needHeat.points || [])
        setDistPoints(distHeat.points || [])
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
    { label: 'Pending Relief Requests', value: stats.pendingRequests ?? 0, color: stats.pendingRequests > 0 ? 'var(--color-warning)' : 'var(--color-text-muted)' },
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h2 className="page-section-title" style={{ margin: 0 }}>Distribution & Need Map</h2>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {needPoints.length > 0 && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={showNeedHeat} onChange={e => setShowNeedHeat(e.target.checked)} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#e74c3c', display: 'inline-block' }} />
                Need Intensity
              </label>
            )}
            {distPoints.length > 0 && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={showDistHeat} onChange={e => setShowDistHeat(e.target.checked)} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#2ecc71', display: 'inline-block' }} />
                Distribution Coverage
              </label>
            )}
          </div>
        </div>
        <div style={{ height: 420, borderRadius: 8, overflow: 'hidden' }}>
          <MapView
            markers={mapData.map((d, i) => ({ lat: 23.0141 + (i % 5) * 0.005, lng: 91.3961 + Math.floor(i / 5) * 0.005, popup: `${d.count} distributions` }))}
            onReady={setMapInstance}
          />
          {mapInstance && showNeedHeat && needPoints.length > 0 && (
            <HeatmapLayer
              map={mapInstance}
              points={needPoints}
              options={{
                radius: 50,
                blur: 10,
                minOpacity: 0.5,
                gradient: { 0.3: 'yellow', 0.5: 'orange', 0.7: '#e74c3c', 0.9: '#c0392b', 1.0: '#8e0000' },
              }}
            />
          )}
          {mapInstance && showDistHeat && distPoints.length > 0 && (
            <HeatmapLayer
              map={mapInstance}
              points={distPoints}
              options={{
                radius: 48,
                blur: 12,
                minOpacity: 0.45,
                gradient: { 0.0: '#e5f5e0', 0.3: '#a1d99b', 0.5: '#41ab5d', 0.7: '#238443', 0.9: '#005a32', 1.0: '#002d14' },
              }}
            />
          )}
        </div>
      </Card>
    </div>
  )
}
