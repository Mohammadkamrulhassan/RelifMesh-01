import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard, getMapData } from './dashboardService'
import { getNeedHeatmap } from '../needs/needService'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import MapView from '../../components/maps/MapView'
import HeatmapLayer from '../../components/maps/HeatmapLayer'
import L from 'leaflet'

export default function PublicDashboard() {
  const [stats, setStats] = useState(null)
  const [mapData, setMapData] = useState([])
  const [heatmapPoints, setHeatmapPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showHeatmap, setShowHeatmap] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    Promise.all([getDashboard(), getMapData(), getNeedHeatmap()])
      .then(([dash, map, heat]) => {
        setStats(dash)
        setMapData(map.data || [])
        setHeatmapPoints(heat.points || [])
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
          <h1 className="page-header-title">Disaster Relief Dashboard</h1>
          <p className="page-header-subtitle">Public Overview — Coordination Across Regions</p>
        </div>
        <Link to="/login" className="btn btn-outline" style={{ textDecoration: 'none' }}>
          Sign In
        </Link>
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
        <Card className="text-center">
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{heatmapPoints.length}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Heatmap Data Points</p>
        </Card>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <h2 className="page-section-title" style={{ marginBottom: 0 }}>Distribution & Need Map</h2>
          {heatmapPoints.length > 0 && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={showHeatmap} onChange={e => setShowHeatmap(e.target.checked)} />
              Show Need Heatmap
            </label>
          )}
        </div>
        <MapViewWithHeatmap
          markers={mapData.map((d, i) => ({ lat: 23.0141 + (i % 5) * 0.005, lng: 91.3961 + Math.floor(i / 5) * 0.005, popup: `${d.count} distributions` }))}
          heatmapPoints={showHeatmap ? heatmapPoints : []}
          onMapReady={instance => { mapRef.current = instance }}
        />
      </Card>

      {heatmapPoints.length > 0 && !showHeatmap && (
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
          Toggle "Show Need Heatmap" to view calculated relief need intensity across areas.
        </p>
      )}
    </div>
  )
}

function MapViewWithHeatmap({ markers, heatmapPoints, onMapReady }) {
  const [map, setMap] = useState(null)

  return (
    <div>
      <MapView markers={markers} onReady={setMap} />
      {map && <HeatmapLayer map={map} points={heatmapPoints} />}
    </div>
  )
}
