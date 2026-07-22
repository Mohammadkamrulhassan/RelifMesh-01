import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard, getMapData, getRecentActivities, getDistributionHeatmap } from '../dashboard/dashboardService'
import { getNeedHeatmap } from '../needs/needService'
import MapView from '../../components/maps/MapView'
import HeatmapLayer from '../../components/maps/HeatmapLayer'
import L from 'leaflet'

export default function LandingPage() {
  const [stats, setStats] = useState(null)
  const [mapData, setMapData] = useState([])
  const [needPoints, setNeedPoints] = useState([])
  const [distPoints, setDistPoints] = useState([])
  const [activities, setActivities] = useState({ distributions: [], reliefRequests: [] })
  const [loading, setLoading] = useState(true)
  const [showNeedHeat, setShowNeedHeat] = useState(false)
  const [showDistHeat, setShowDistHeat] = useState(false)
  const [map, setMap] = useState(null)

  useEffect(() => {
    Promise.allSettled([getDashboard(), getMapData(), getNeedHeatmap(), getDistributionHeatmap(), getRecentActivities()])
      .then(([dash, mapRes, needHeat, distHeat, acts]) => {
        if (dash.status === 'fulfilled') setStats(dash.value)
        if (mapRes.status === 'fulfilled') setMapData(mapRes.value.data || [])
        if (needHeat.status === 'fulfilled') setNeedPoints(needHeat.value.points || [])
        if (distHeat.status === 'fulfilled') setDistPoints(distHeat.value.points || [])
        if (acts.status === 'fulfilled') setActivities(acts.value)
        if (needHeat.status === 'rejected' || distHeat.status === 'rejected') {
          console.warn('Heatmap API failed to load — some layers may not appear')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* ─── Top Navigation ─── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--color-primary)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#fff',
          }}>R</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Relief<span style={{ color: 'var(--color-accent)' }}>Mesh</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/overview" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>System Overview</Link>
          <Link to="/login" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>Sign In</Link>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section style={{
        textAlign: 'center', padding: '80px 24px 48px',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a3a6b 100%)',
        color: '#fff',
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, marginBottom: 16 }}>
          Disaster Relief Coordination System
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', opacity: 0.9, maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.7 }}>
          ReliefMesh enables real-time tracking of relief distributions, need assessments,
          and resource coordination across administrative regions — even in offline environments.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/overview" className="btn" style={{
            background: '#fff', color: 'var(--color-primary)', fontWeight: 600,
            padding: '12px 28px', borderRadius: 8, fontSize: 15, textDecoration: 'none',
          }}>Explore System Overview</Link>
          <Link to="/register" className="btn" style={{
            background: 'transparent', color: '#fff', fontWeight: 500,
            padding: '12px 28px', borderRadius: 8, fontSize: 15, textDecoration: 'none',
            border: '2px solid rgba(255,255,255,0.4)',
          }}>Register as Citizen</Link>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16,
        }}>
          {[
            { label: 'Households Registered', value: stats?.totalHouseholds ?? 0, color: 'var(--color-primary)' },
            { label: 'Distributions Logged', value: stats?.totalDistributions ?? 0, color: 'var(--color-success)' },
            { label: 'Active Regions', value: stats?.totalAreas ?? 0, color: 'var(--color-info)' },
            { label: 'Item Categories', value: stats?.totalItemCategories ?? 0, color: 'var(--color-accent)' },
          ].map(c => (
            <div key={c.label} style={{
              background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)',
              padding: '24px 16px', textAlign: 'center', boxShadow: 'var(--shadow-sm)',
            }}>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: c.color }}>{c.value}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Map Section ─── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{
          background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)',
          padding: 24, boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Distribution & Need Map</h2>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Real-time visualization of relief activities across regions
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', opacity: needPoints.length === 0 ? 0.5 : 1 }}>
                <input type="checkbox" checked={showNeedHeat} onChange={e => setShowNeedHeat(e.target.checked)} disabled={needPoints.length === 0} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#e74c3c', display: 'inline-block' }} />
                Need Intensity ({(needPoints.length || 0)} pts)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', opacity: distPoints.length === 0 ? 0.5 : 1 }}>
                <input type="checkbox" checked={showDistHeat} onChange={e => setShowDistHeat(e.target.checked)} disabled={distPoints.length === 0} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#2ecc71', display: 'inline-block' }} />
                Distribution Coverage ({(distPoints.length || 0)} pts)
              </label>
            </div>
          </div>
          <div style={{ height: 420, borderRadius: 8, overflow: 'hidden' }}>
            <MapViewWithHeatmap
              markers={mapData
                .filter(d => d.lat && d.lng)
                .map(d => ({ lat: d.lat, lng: d.lng, popup: `${d.count} distributions in ${d.areaName || 'Unknown'}` }))}
              needPoints={showNeedHeat ? needPoints : []}
              distPoints={showDistHeat ? distPoints : []}
              onMapReady={setMap}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8, textAlign: 'center' }}>
            {(showNeedHeat || showDistHeat)
              ? 'Heatmap overlay colors indicate intensity — warm (red) = higher need, cool (green) = more relief delivered.'
              : 'Toggle heatmap layers above to visualize relief need and distribution coverage across regions.'
            }
          </p>
        </div>
      </section>

      {/* ─── Recent Activities ─── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Recent Activities</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Recent Distributions */}
          <div style={{
            background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)',
            padding: 20,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--color-text-secondary)' }}>
              Recent Distributions
            </h3>
            {activities.distributions.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No distributions yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activities.distributions.map(d => (
                  <div key={d._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--color-border)',
                  }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{d.householdId?.headName || 'Unknown'}</p>
                      <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{d.itemCategoryId?.name || 'Item'} · {d.quantity} units</p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {d.distributedAt ? new Date(d.distributedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Recent Relief Requests */}
          <div style={{
            background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)',
            padding: 20,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--color-text-secondary)' }}>
              Recent Relief Requests
            </h3>
            {activities.reliefRequests.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No relief requests yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activities.reliefRequests.map(r => (
                  <div key={r._id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--color-border)',
                  }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{r.userId?.name || 'Anonymous'}</p>
                      <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{r.status || 'PENDING'}</p>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        borderTop: '1px solid var(--color-border)', padding: '24px 48px',
        textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)',
      }}>
        <p>ReliefMesh — Disaster Relief Coordination System. CSE 3208, RMSTU.</p>
        <p style={{ marginTop: 4 }}>
          <Link to="/overview" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>System Overview</Link>
          {' · '}
          <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </footer>
    </div>
  )
}

function MapViewWithHeatmap({ markers, needPoints, distPoints, onMapReady }) {
  const [mapInstance, setMapInstance] = useState(null)

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapView markers={markers} onReady={m => { setMapInstance(m); onMapReady(m) }} />
      {mapInstance && needPoints.length > 0 && (
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
      {mapInstance && distPoints.length > 0 && (
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
  )
}
