import { useState, useEffect } from 'react'
import { listAlerts, resolveAlert } from './adminService'
import { formatDateTime } from '../../utils/formatters'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Button from '../../components/common/Button'

export default function Admin() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolveId, setResolveId] = useState(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    listAlerts()
      .then(data => setAlerts(data.alerts))
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  async function handleResolve(id) {
    try {
      await resolveAlert(id, reason)
      setAlerts(a => a.filter(al => al._id !== id))
      setResolveId(null)
      setReason('')
    } catch (err) {
      setError(err.error || 'Failed to resolve')
    }
  }

  if (loading) return <Loading message="Loading admin..." />
  if (error) return <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>

  const unresolved = alerts.filter(a => !a.isResolved)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <Card>
        <h2 className="font-semibold mb-4">Duplicate Alerts ({unresolved.length})</h2>
        {unresolved.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No unresolved alerts.</p>
        ) : (
          <div className="space-y-3">
            {unresolved.map(alert => (
              <div key={alert._id} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Household: <span className="font-medium text-gray-800">{alert.householdId}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(alert.createdAt)}</p>
                {resolveId === alert._id ? (
                  <div className="mt-3 flex gap-2">
                    <input className="input-field flex-1" value={reason} onChange={e => setReason(e.target.value)} placeholder="Override reason..." />
                    <Button onClick={() => handleResolve(alert._id)} disabled={!reason}>Resolve</Button>
                    <Button variant="ghost" onClick={() => setResolveId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="secondary" size="sm" className="mt-2" onClick={() => setResolveId(alert._id)}>Resolve</Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
