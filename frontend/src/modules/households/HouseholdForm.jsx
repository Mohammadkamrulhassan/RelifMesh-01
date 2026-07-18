import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createHousehold, getHousehold, updateHousehold } from './householdService'
import { getCurrentPosition } from '../../utils/geo'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../components/ui/Toast'
import Input from '../../components/ui/Input'
import InputField from '../../components/forms/InputField'
import SelectField from '../../components/forms/SelectField'
import PhotoCapture from '../../components/forms/PhotoCapture'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function HouseholdForm() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  if (user?.role !== 'UP_OFFICIAL' && user?.role !== 'UPAZILA_OFFICER') {
    return <div className="page-section" style={{ color: 'var(--color-danger)', padding: 'var(--space-6)', textAlign: 'center' }}>You do not have permission to register households. Only UP Officials and Upazila Officers can perform this action.</div>
  }

  const [form, setForm] = useState({
    headName: '', nid: '', familySize: '',
    gps: { lat: '', lng: '' },
    vulnerabilityFlags: { elderly: false, disabled: false, pregnant: false },
    photoUrl: null,
    familyMembers: [],
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showMembers, setShowMembers] = useState(false)

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
          familyMembers: household.familyMembers || [],
        })
        if (household.familyMembers?.length) setShowMembers(true)
      }).catch(err => setError(err.error || 'Failed to load'))
    }
  }, [id])

  async function captureGPS() {
    try {
      const pos = await getCurrentPosition()
      setForm(f => ({ ...f, gps: { lat: pos.lat, lng: pos.lng } }))
    } catch {
      addToast('GPS capture failed. Enter coordinates manually.', 'warning')
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

  function handleMemberChange(idx, field, value) {
    setForm(f => {
      const members = [...f.familyMembers]
      members[idx] = { ...members[idx], [field]: value }
      if (field === 'age') {
        members[idx].idType = parseInt(value) < 18 ? 'BIRTH' : 'NID'
      }
      return { ...f, familyMembers: members }
    })
  }

  function addMember() {
    setForm(f => ({ ...f, familyMembers: [...f.familyMembers, { name: '', age: '', idType: 'NID', idNumber: '' }] }))
  }

  function removeMember(idx) {
    setForm(f => ({ ...f, familyMembers: f.familyMembers.filter((_, i) => i !== idx) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        familySize: showMembers && form.familyMembers.length > 0 ? undefined : Number(form.familySize),
        gps: { lat: Number(form.gps.lat), lng: Number(form.gps.lng) },
      }
      if (!payload.familyMembers?.length) delete payload.familyMembers
      if (isEdit) {
        await updateHousehold(id, payload)
      } else {
        await createHousehold(payload)
      }
      navigate('/app/households')
    } catch (err) {
      const msg = err.details ? err.details.map(d => `${d.param}: ${d.msg}`).join('; ') : (err.message || err.error || 'Failed to save household')
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">{isEdit ? 'Edit Household' : 'Register Household'}</h1>
          <p className="page-header-subtitle">{isEdit ? 'Update household information' : 'Add a new household to the system'}</p>
        </div>
      </div>
      {error && <div className="page-section" style={{ background: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', fontSize: '0.875rem' }}>{error}</div>}

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Head of Household Name" name="headName" value={form.headName} onChange={handleChange} required />
          <Input label="NID Number" name="nid" value={form.nid} onChange={handleChange} required />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <p className="input-label" style={{ margin: 0 }}>Family Members</p>
              <Button type="button" variant="secondary" size="sm" onClick={() => { setShowMembers(s => !s) }}>
                {showMembers ? 'Use count instead' : 'Add members individually'}
              </Button>
            </div>

            {showMembers ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {form.familyMembers.map((m, i) => (
                  <div key={i} style={{ padding: 'var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeMember(i)}
                      style={{ position: 'absolute', top: '4px', right: '4px', color: 'var(--color-danger)', fontSize: '0.75rem' }}>×</Button>
                    <div className="form-member-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr', gap: 'var(--space-2)' }}>
                      <Input name={`m_name_${i}`} placeholder="Name" value={m.name} onChange={e => handleMemberChange(i, 'name', e.target.value)} required />
                      <Input name={`m_age_${i}`} type="number" placeholder="Age" min="0" max="150" value={m.age} onChange={e => handleMemberChange(i, 'age', e.target.value)} required />
                      <div>
                        <SelectField label="" name={`m_idtype_${i}`} value={m.idType} onChange={e => handleMemberChange(i, 'idType', e.target.value)}>
                          <option value="NID">NID</option>
                          <option value="BIRTH">Birth ID</option>
                        </SelectField>
                      </div>
                      <Input name={`m_idnum_${i}`} placeholder="ID Number" value={m.idNumber} onChange={e => handleMemberChange(i, 'idNumber', e.target.value)} required />
                    </div>
                    {parseInt(m.age) < 18 && m.idType === 'NID' && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '4px' }}>Members under 18 should use Birth ID instead of NID</p>
                    )}
                    {parseInt(m.age) >= 18 && m.idType === 'BIRTH' && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '4px' }}>Members 18+ should use NID instead of Birth ID</p>
                    )}
                  </div>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={addMember}>+ Add Member</Button>
              </div>
            ) : (
              <Input label="Family Size" name="familySize" type="number" min="1" value={form.familySize} onChange={handleChange} required />
            )}
          </div>

          <div>
            <p className="input-label" style={{ marginBottom: 'var(--space-2)' }}>GPS Location</p>
            <div className="form-gps-row" style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <InputField name="gps.lat" placeholder="Latitude" value={form.gps.lat} onChange={handleChange} className="mb-0 flex-1" />
              <InputField name="gps.lng" placeholder="Longitude" value={form.gps.lng} onChange={handleChange} className="mb-0 flex-1" />
            </div>
            <Button type="button" variant="secondary" onClick={captureGPS}>Capture Current Location</Button>
          </div>

          <div>
            <p className="input-label" style={{ marginBottom: 'var(--space-2)' }}>Vulnerability Flags</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {['elderly', 'disabled', 'pregnant'].map(flag => (
                <label key={flag} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" name={`vf.${flag}`} checked={form.vulnerabilityFlags[flag]} onChange={handleChange} style={{ accentColor: 'var(--color-primary)' }} />
                  <span style={{ textTransform: 'capitalize' }}>{flag}</span>
                </label>
              ))}
            </div>
          </div>

          <PhotoCapture onCapture={url => setForm(f => ({ ...f, photoUrl: url }))} currentUrl={form.photoUrl} />

          <div className="page-actions" style={{ justifyContent: 'flex-start' }}>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : (isEdit ? 'Update' : 'Register')}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/app/households')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
