import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPledge, listCategories } from './pledgeService.js'
import { listAreas } from '../needs/needService'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import SelectField from '../../components/forms/SelectField'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function PledgeForm() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [areas, setAreas] = useState([])
  const [form, setForm] = useState({
    source_type: '',
    source_name: '',
    source_contact: '',
    areaId: '',
    customArea: '',
    itemCategoryId: '',
    total_qty: '',
    expected_delivery_date: '',
    notes: '',
  })
  const [manualArea, setManualArea] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listCategories().then(d => setCategories(d.categories || [])).catch(() => {})
    listAreas({ level: 'WARD' }).then(d => setAreas(d.areas || [])).catch(() => {})
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        total_qty: Number(form.total_qty),
        expected_delivery_date: form.expected_delivery_date ? new Date(form.expected_delivery_date).toISOString() : null,
      }
      // Auto-set source_type for citizens
      if (user?.role === 'CITIZEN') {
        payload.source_type = 'INDIVIDUAL'
        payload.source_name = user.name || 'Anonymous'
      }
      await createPledge(payload)
      navigate('/app/pledges')
    } catch (err) {
      setError(err.error || 'Failed to create pledge')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Make a Pledge</h1>
          <p className="page-header-subtitle">Declare your relief contribution commitment</p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', borderRadius: '8px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {user?.role !== 'CITIZEN' && (
            <>
              <SelectField label="Source Type" name="source_type" value={form.source_type} onChange={handleChange} required>
                <option value="">Select source...</option>
                <option value="GOVERNMENT">Government</option>
                <option value="NGO">NGO</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="CORPORATE">Corporate</option>
              </SelectField>
              <Input label="Source Name" name="source_name" value={form.source_name} onChange={handleChange} placeholder="Organization or person name" required />
            </>
          )}
          {user?.role !== 'CITIZEN' && (
            <Input label="Contact (optional)" name="source_contact" value={form.source_contact} onChange={handleChange} placeholder="Phone or email" />
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <p className="input-label" style={{ margin: 0 }}>Target Area (Ward)</p>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setManualArea(s => !s); setForm(f => ({ ...f, areaId: '', customArea: '' })) }}>
                {manualArea ? 'Pick from list' : 'Type manually'}
              </Button>
            </div>
            {manualArea || areas.length === 0 ? (
              <Input name="customArea" value={form.customArea} onChange={handleChange} placeholder="Type ward name..." />
            ) : (
              <SelectField label="" name="areaId" value={form.areaId} onChange={handleChange}>
                <option value="">Select ward...</option>
                {areas.map(a => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </SelectField>
            )}
          </div>

          <SelectField label="Item Category" name="itemCategoryId" value={form.itemCategoryId} onChange={handleChange} required>
            <option value="">Select item...</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </SelectField>

          <Input label="Total Quantity" name="total_qty" type="number" min="0.01" step="0.01" value={form.total_qty} onChange={handleChange} required />

          <Input label="Expected Delivery Date (optional)" name="expected_delivery_date" type="date" value={form.expected_delivery_date} onChange={handleChange} />

          <div>
            <label className="input-label">Notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-input-bg)', color: 'var(--color-text-primary)', resize: 'vertical' }}
              placeholder="Any additional information about this pledge..."
            />
          </div>

          <div className="page-actions" style={{ justifyContent: 'flex-start' }}>
            <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Pledge'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/app/pledges')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
