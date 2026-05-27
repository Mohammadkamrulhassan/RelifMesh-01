import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listHouseholds } from './householdService'
import { formatDate } from '../../utils/formatters'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'

export default function Households() {
  const [households, setHouseholds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listHouseholds()
      .then(data => setHouseholds(data.households))
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading message="Loading households..." />
  if (error) return <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Households</h1>
        <Link to="/households/new"><Button>Register Household</Button></Link>
      </div>
      {households.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-8">No households registered yet.</p></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {households.map(h => (
            <Link key={h._id || h.hhId} to={`/households/${h._id || h.hhId}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg mb-1">{h.headName}</h3>
                <p className="text-sm text-gray-500">NID: {h.nid}</p>
                <p className="text-sm text-gray-500">Family: {h.familySize}</p>
                <p className="text-xs text-gray-400 mt-2">Registered: {formatDate(h.createdAt)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
