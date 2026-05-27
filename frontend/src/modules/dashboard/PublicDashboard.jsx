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
  if (error) return <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary-800">RelifMesh</h1>
        <p className="text-gray-500 mt-1">Disaster Relief Coordination Dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary-600">{stats?.totalHouseholds || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Households Registered</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary-600">{stats?.totalDistributions || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Distributions Logged</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary-600">{stats?.unions?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Item Categories</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold mb-3">Distribution Map</h2>
        <MapView markers={mapData.map(d => ({ lat: 23.8, lng: 90.4, popup: `${d.count} distributions` }))} />
      </Card>
    </div>
  )
}
