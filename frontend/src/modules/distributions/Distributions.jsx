import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listDistributions } from './distributionService'
import { formatDateTime } from '../../utils/formatters'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'

export default function Distributions() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    listDistributions()
      .then(data => setLogs(data.logs))
      .catch(err => setError(err.error || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading message="Loading distributions..." />
  if (error) return <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{error}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Distributions</h1>
        <Link to="/distributions/new"><Button>Log Distribution</Button></Link>
      </div>
      {logs.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-8">No distributions recorded yet.</p></Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Household</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Item</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Qty</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{log.householdId?.headName || log.householdId}</td>
                  <td className="py-3 px-4">{log.unit}</td>
                  <td className="py-3 px-4">{log.quantity}</td>
                  <td className="py-3 px-4 text-gray-500">{formatDateTime(log.distributedAt)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      log.syncStatus === 'SYNCED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {log.syncStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
