import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createHousehold, getHousehold, updateHousehold } from './householdService'
import { getCurrentPosition } from '../../utils/geo'
import InputField from '../../components/forms/InputField'
import PhotoCapture from '../../components/forms/PhotoCapture'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function HouseholdForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    headName: '', nid: '', familySize: '',
    gps: { lat: '', lng: '' },
    vulnerabilityFlags: { elderly: false, disabled: false, pregnant: false },
    photoUrl: null,
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getHousehold(id).then(({ household }) => {
        setForm({
          headName: household.headName,
          nid: household.nid,
          familySize: household.familySize,
          gps: household.gps || { lat: '', lng: '' },
          vulnerabilityFlags: household.vulnerabilityFlags || {},
          photoUrl: household.photoUrl || null,
        })
      }).catch(err => setError(err.error || 'Failed to load'))
    }
  }, [id])

  async function captureGPS() {
    try {
      const pos = await getCurrentPosition()
      setForm(f => ({ ...f, gps: { lat: pos.lat, lng: pos.lng } }))
    } catch {
      setError('GPS capture failed. Enter coordinates manually.')
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    if (name.startsWith('vf.')) {
      const flag = name.split('.')[1]
      setForm(f => ({ ...f, vulnerabilityFlags: { ...f.vulnerabilityFlags, [flag]: checked } }))
    } else if (name === 'gps.lat' || name === 'gps.lng') {
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
        familySize: Number(form.familySize),
        gps: { lat: Number(form.gps.lat), lng: Number(form.gps.lng) },
      }
      if (isEdit) {
        await updateHousehold(id, payload)
      } else {
        await createHousehold(payload)
      }
      navigate('/households')
    } catch (err) {
      setError(err.error || 'Failed to save household')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Household' : 'Register Household'}</h1>
      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Head of Household Name" name="headName" value={form.headName} onChange={handleChange} required />
          <InputField label="NID Number" name="nid" value={form.nid} onChange={handleChange} required />
          <InputField label="Family Size" name="familySize" type="number" min="1" value={form.familySize} onChange={handleChange} required />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GPS Location</label>
            <div className="flex gap-2 mb-2">
              <InputField name="gps.lat" placeholder="Latitude" value={form.gps.lat} onChange={handleChange} className="mb-0 flex-1" />
              <InputField name="gps.lng" placeholder="Longitude" value={form.gps.lng} onChange={handleChange} className="mb-0 flex-1" />
            </div>
            <Button type="button" variant="secondary" onClick={captureGPS}>Capture Current Location</Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vulnerability Flags</label>
            <div className="space-y-2">
              {['elderly', 'disabled', 'pregnant'].map(flag => (
                <label key={flag} className="flex items-center gap-2">
                  <input type="checkbox" name={`vf.${flag}`} checked={form.vulnerabilityFlags[flag]} onChange={handleChange} className="rounded border-gray-300" />
                  <span className="text-sm capitalize">{flag}</span>
                </label>
              ))}
            </div>
          </div>

          <PhotoCapture onCapture={url => setForm(f => ({ ...f, photoUrl: url }))} currentUrl={form.photoUrl} />

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : (isEdit ? 'Update' : 'Register')}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/households')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
