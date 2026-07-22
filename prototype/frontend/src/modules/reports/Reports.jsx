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
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Reports</h1>
          <p className="page-header-subtitle">Export distribution logs</p>
        </div>
      </div>
      {error && <div className="page-section" style={{ background: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', fontSize: '0.875rem' }}>{error}</div>}
      <Card style={{ maxWidth: '480px' }}>
        <h2 className="page-section-title">Export Distribution Logs</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <p className="input-label" style={{ marginBottom: 'var(--space-2)' }}>Export Format</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              {['csv', 'pdf'].map(f => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} style={{ accentColor: 'var(--color-primary)' }} />
                  <span style={{ textTransform: 'uppercase', fontWeight: 500 }}>{f}</span>
                </label>
              ))}
            </div>
          </div>
          <Button onClick={handleExport} disabled={exporting} leftIcon={exporting ? undefined : <span style={{ fontSize: '1rem' }}>↓</span>}>
            {exporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
          </Button>
        </div>
      </Card>
    </div>
  )
}
