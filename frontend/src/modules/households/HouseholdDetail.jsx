import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getHousehold } from './householdService'
import { formatDateTime } from '../../utils/formatters'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Button from '../../components/common/Button'
import MapView from '../../components/maps/MapView'

export default function HouseholdDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [household, setHousehold] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getHousehold(id)
      .then(({ household }) => setHousehold(household))
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading message="Loading household..." />
  if (error) return <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>
  if (!household) return <div className="text-gray-500">Household not found</div>

  const markers = household.gps?.lat ? [{ lat: household.gps.lat, lng: household.gps.lng, popup: household.headName }] : []

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{household.headName}</h1>
        <div className="flex gap-2">
          <Link to={`/households/${id}/edit`}><Button variant="secondary">Edit</Button></Link>
          <Button variant="ghost" onClick={() => navigate('/households')}>Back</Button>
        </div>
      </div>

      <Card className="mb-6">
        <dl className="grid grid-cols-2 gap-4">
          <div><dt className="text-xs text-gray-500 uppercase">NID</dt><dd className="font-medium">{household.nid}</dd></div>
          <div><dt className="text-xs text-gray-500 uppercase">Family Size</dt><dd className="font-medium">{household.familySize}</dd></div>
          <div><dt className="text-xs text-gray-500 uppercase">GPS</dt><dd className="font-medium text-sm">{household.gps ? `${household.gps.lat}, ${household.gps.lng}` : 'Not set'}</dd></div>
          <div><dt className="text-xs text-gray-500 uppercase">Registered</dt><dd className="font-medium text-sm">{formatDateTime(household.createdAt)}</dd></div>
        </dl>
      </Card>

      <Card className="mb-6">
        <h2 className="font-semibold mb-3">Vulnerability Flags</h2>
        <div className="flex gap-3">
          {['elderly', 'disabled', 'pregnant'].map(f => (
            <span key={f} className={`px-3 py-1 rounded-full text-xs font-medium ${household.vulnerabilityFlags?.[f] ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
              {f}
            </span>
          ))}
        </div>
      </Card>

      {household.photoUrl && (
        <Card className="mb-6">
          <h2 className="font-semibold mb-3">Photo</h2>
          <img src={household.photoUrl} alt="Household" className="max-w-sm rounded-lg border" />
        </Card>
      )}

      {markers.length > 0 && (
        <Card>
          <h2 className="font-semibold mb-3">Location</h2>
          <MapView markers={markers} center={[household.gps.lat, household.gps.lng]} zoom={15} />
        </Card>
      )}
    </div>
  )
}
