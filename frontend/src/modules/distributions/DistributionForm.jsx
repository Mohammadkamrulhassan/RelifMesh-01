import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDistribution, duplicateCheck } from './distributionService'
import { listHouseholds } from '../households/householdService'
import { get } from '../../services/api'
import { getCurrentPosition } from '../../utils/geo'
import InputField from '../../components/forms/InputField'
import SelectField from '../../components/forms/SelectField'
import PhotoCapture from '../../components/forms/PhotoCapture'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function DistributionForm() {
  const navigate = useNavigate()
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
    get('/public/dashboard').then(d => setCategories(d.unions || [])).catch(() => {})
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Log Distribution</h1>
      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}
      {duplicateWarning && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm px-4 py-3 rounded-lg mb-4">
          This household already received this item category recently.
        </div>
      )}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField label="Household" name="householdId" value={form.householdId} onChange={handleHouseholdChange} required>
            <option value="">Select household...</option>
            {households.map(h => (
              <option key={h._id} value={h._id}>{h.headName} ({h.nid})</option>
            ))}
          </SelectField>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Quantity" name="quantity" type="number" min="0.01" step="0.01" value={form.quantity} onChange={handleChange} required />
            <InputField label="Unit" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, pcs, liters" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GPS Location</label>
            <div className="flex gap-2 mb-2">
              <InputField name="gps.lat" placeholder="Latitude" value={form.gps.lat} onChange={handleChange} className="mb-0 flex-1" />
              <InputField name="gps.lng" placeholder="Longitude" value={form.gps.lng} onChange={handleChange} className="mb-0 flex-1" />
            </div>
            <Button type="button" variant="secondary" onClick={captureGPS}>Capture Current Location</Button>
          </div>

          <InputField label="Distribution Date & Time" name="distributedAt" type="datetime-local" value={form.distributedAt} onChange={handleChange} required />

          <PhotoCapture onCapture={url => setForm(f => ({ ...f, photoUrl: url }))} currentUrl={form.photoUrl} />

          {duplicateWarning && (
            <InputField label="Override Reason (required)" name="overrideReason" value={form.overrideReason} onChange={handleChange} placeholder="Why is this additional distribution needed?" required />
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Log Distribution'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/distributions')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
