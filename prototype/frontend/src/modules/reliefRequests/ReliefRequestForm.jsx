import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRequest, listCategories } from './reliefRequestService'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import SelectField from '../../components/forms/SelectField'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function ReliefRequestForm() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (user?.role !== 'CITIZEN') {
    return <div className="page-section" style={{ color: 'var(--color-danger)', padding: 'var(--space-6)', textAlign: 'center' }}>Only citizens can submit relief requests.</div>
  }

  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([{ itemCategoryId: '', quantity: '', unit: '' }])
  const [form, setForm] = useState({
    description: '',
    priority: 'MEDIUM',
    location: { address: '' },
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listCategories().then(d => setCategories(d.categories || [])).catch(() => {})
  }, [])

  function addItem() {
    setItems(prev => [...prev, { itemCategoryId: '', quantity: '', unit: '' }])
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function handleItemChange(index, field, value) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item))
  }

  function handleChange(e) {
    const { name, value } = e.target
    if (name.startsWith('location.')) {
      const key = name.split('.')[1]
      setForm(f => ({ ...f, location: { ...f.location, [key]: value } }))
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
        items: items.map(item => ({
          itemCategoryId: item.itemCategoryId,
          quantity: Number(item.quantity),
          unit: item.unit,
        })),
      }
      await createRequest(payload)
      navigate('/app/relief-requests')
    } catch (err) {
      setError(err.error || 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Request Relief</h1>
          <p className="page-header-subtitle">Submit a new relief assistance request</p>
        </div>
      </div>

      {error && <div style={{ background: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', fontSize: '0.875rem' }}>{error}</div>}

      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <p className="input-label">Items Needed *</p>
            {items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: '2 1 180px', minWidth: '140px' }}>
                  <SelectField label="" name={`itemCategoryId-${index}`} value={item.itemCategoryId} onChange={e => handleItemChange(index, 'itemCategoryId', e.target.value)} required>
                    <option value="">Select item...</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </SelectField>
                </div>
                <div style={{ flex: '1 0 80px' }}>
                  <Input label="" name={`quantity-${index}`} type="number" min="0.01" step="0.01" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} required />
                </div>
                <div style={{ flex: '1 0 80px' }}>
                  <Input label="" name={`unit-${index}`} placeholder="Unit" value={item.unit} onChange={e => handleItemChange(index, 'unit', e.target.value)} required />
                </div>
                {items.length > 1 && (
                  <Button type="button" variant="danger" size="sm" onClick={() => removeItem(index)}>×</Button>
                )}
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addItem}>+ Add Item</Button>
          </div>

          <SelectField label="Priority" name="priority" value={form.priority} onChange={handleChange}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </SelectField>

          <Input label="Description" name="description" value={form.description} onChange={handleChange} placeholder="Describe your situation and why relief is needed" />

          <Input label="Your Address" name="location.address" value={form.location.address} onChange={handleChange} placeholder="Village, union, upazila, district" />

          <div className="page-actions" style={{ justifyContent: 'flex-start' }}>
            <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Request'}</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/app/relief-requests')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
