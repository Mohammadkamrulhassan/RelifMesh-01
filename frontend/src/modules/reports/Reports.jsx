import { useState } from 'react'
import { triggerExport } from './reportService'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

export default function Reports() {
  const [format, setFormat] = useState('csv')
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  async function handleExport() {
    setExporting(true)
    setError('')
    try {
      await triggerExport(format)
    } catch (err) {
      setError(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}
      <Card className="max-w-md">
        <h2 className="font-semibold mb-4">Export Distribution Logs</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="flex gap-4">
              {['csv', 'pdf'].map(f => (
                <label key={f} className="flex items-center gap-2">
                  <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} className="text-primary-600" />
                  <span className="text-sm uppercase">{f}</span>
                </label>
              ))}
            </div>
          </div>
          <Button onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
          </Button>
        </div>
      </Card>
    </div>
  )
}
