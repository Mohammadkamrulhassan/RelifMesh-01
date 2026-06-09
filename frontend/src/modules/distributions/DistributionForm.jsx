import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDistribution, duplicateCheck, listCategories } from './distributionService'
import { listHouseholds } from '../households/householdService'
import { getCurrentPosition } from '../../utils/geo'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import InputField from '../../components/forms/InputField'
import SelectField from '../../components/forms/SelectField'
import PhotoCapture from '../../components/forms/PhotoCapture'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function DistributionForm() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (user?.role !== 'UP_OFFICIAL' && user?.role !== 'NGO_WORKER') {
    return <div className="page-section" style={{ color: 'var(--color-danger)', padding: 'var(--space-6)', textAlign: 'center' }}>You do not have permission to log distributions. Only UP Officials and NGO Workers can perform this action.</div>
  }
  const [households, setHouseholds] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    householdId: '', itemCategoryId: '', quantity: '', unit: '',
    gps: { lat: '', lng: '' },
    photoUrl: null, distributedAt: new Date().toISOString().slice(0, 16),
    overrideReason: '',
  })
  const [duplicateWarning, setDuplicateWarning] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listHouseholds().then(d => setHouseholds(d.households)).catch(() => {})
    listCategories().then(d => setCategories(d.categories || [])).catch(() => {})
  }, [])

  async function handleHouseholdChange(e) {
    const hhId = e.target.value
    setForm(f => ({ ...f, householdId: hhId }))
    if (hhId && form.itemCategoryId) {
      try {
        const { isDuplicate, priorLog } = await duplicateCheck(hhId, form.itemCategoryId)
        setDuplicateWarning(isDuplicate ? priorLog : null)
      } catch {}
    }
  }

  async function handleCategoryChange(e) {
    const catId = e.target.value
    setForm(f => ({ ...f, itemCategoryId: catId }))
    if (form.householdId && catId) {
      try {
        const { isDuplicate, priorLog } = await duplicateCheck(form.householdId, catId)
        setDuplicateWarning(isDuplicate ? priorLog : null)
      } catch {}
    }
  }

  async function captureGPS() {
    try {
      const pos = await getCurrentPosition()
      setForm(f => ({ ...f, gps: { lat: pos.lat, lng: pos.lng } }))
    } catch {
      setError('GPS capture failed')
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'gps.lat' || name === 'gps.lng') {
      const key = name.split('.')[1]
      setForm(f => ({ ...f, gps: { ...f.gps, [key]: value } }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        gps: { lat: Number(form.gps.lat), lng: Number(form.gps.lng) },
        distributedAt: new Date(form.distributedAt).toISOString(),
      }
      await createDistribution(payload)
      navigate('/distributions')
    } catch (err) {
      if (err.status === 409) {
        setDuplicateWarning(err.priorLog)
        setError('Duplicate detected. Provide an override reason below to confirm.')
      } else {
        setError(err.error || 'Failed to log distribution')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Log Distribution</h1>
          <p className="page-header-subtitle">Record a new distribution event</p>
        </div>
      </div>

      {error && <div className="page-section" style={{ background: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', fontSize: '0.875rem' }}>{error}</div>}
      {duplicateWarning && (
        <div className="page-section" style={{ background: 'var(--color-warning-light)', borderColor: 'var(--color-warning)', color: 'var(--color-warning)', marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', fontSize: '0.875rem' }}>
          This household already received this item category recently.
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <SelectField label="Household" name="householdId" value={form.householdId} onChange={handleHouseholdChange} required>
            <option value="">Select household...</option>
            {households.map(h => (
              <option key={h._id} value={h._id}>{h.headName} ({h.nid})</option>
            ))}
          </SelectField>

          <SelectField label="Item Category" name="itemCategoryId" value={form.itemCategoryId} onChange={handleCategoryChange} required>
            <option value="">Select item category...</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </SelectField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Quantity" name="quantity" type="number" min="0.01" step="0.01" value={form.quantity} onChange={handleChange} required />
            <Input label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, pcs, liters" required />
          </div>

          <div>
            <p className="input-label" style={{ marginBottom: 'var(--space-2)' }}>GPS Location</p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <InputField name="gps.lat" placeholder="Latitude" value={form.gps.lat} onChange={handleChange} className="mb-0 flex-1" />
              <InputField name="gps.lng" placeholder="Longitude" value={form.gps.lng} onChange={handleChange} className="mb-0 flex-1" />
            </div>
            <Button type="button" variant="secondary" onClick={captureGPS}>Capture Current Location</Button>
          </div>

          <Input label="Distribution Date & Time" name="distributedAt" type="datetime-local" value={form.distributedAt} onChange={handleChange} required />

          <PhotoCapture onCapture={url => setForm(f => ({ ...f, photoUrl: url }))} currentUrl={form.photoUrl} />

          {duplicateWarning && (
            <Input label="Override Reason (required)" name="overrideReason" value={form.overrideReason} onChange={handleChange} placeholder="Why is this additional distribution needed?" required />
          )}

          <div className="page-actions" style={{ justifyContent: 'flex-start' }}>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Log Distribution'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/distributions')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
