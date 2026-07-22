import { useState } from 'react'
import { post } from '../../services/api'
import { useToast } from '../../components/ui/Toast'
import Input from '../../components/ui/Input'
import SelectField from '../../components/forms/SelectField'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function FeedbackForm() {
  const { addToast } = useToast()
  const [form, setForm] = useState({ name: '', contact: '', category: 'OTHER', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await post('/feedback', form)
      setSubmitted(true)
      addToast('Feedback submitted successfully', 'success')
    } catch {
      addToast('Failed to submit feedback', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: 'var(--space-12) 0' }}>
        <Card>
          <h2 className="page-section-title" style={{ color: 'var(--color-success)' }}>Thank You!</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Your feedback has been received. We appreciate your input.
          </p>
          <Button onClick={() => { setSubmitted(false); setForm({ name: '', contact: '', category: 'OTHER', message: '' }) }}>
            Submit Another
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Send Feedback</h1>
          <p className="page-header-subtitle">We value your opinion — help us improve</p>
        </div>
      </div>
      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Your Name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Contact (optional)" name="contact" value={form.contact} onChange={handleChange} placeholder="Phone or email" />
          <SelectField label="Category" name="category" value={form.category} onChange={handleChange}>
            <option value="COMPLAINT">Complaint</option>
            <option value="SUGGESTION">Suggestion</option>
            <option value="INQUIRY">Inquiry</option>
            <option value="APPRECIATION">Appreciation</option>
            <option value="OTHER">Other</option>
          </SelectField>
          <div>
            <p className="input-label" style={{ marginBottom: 'var(--space-2)' }}>Message *</p>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              maxLength={1000}
              rows={5}
              className="input-field"
              style={{
                width: '100%', resize: 'vertical', padding: '12px',
                border: '1px solid var(--color-input-border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
              }}
              placeholder="Write your feedback here..."
            />
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px', textAlign: 'right' }}>{form.message.length}/1000</p>
          </div>
          <div className="page-actions" style={{ justifyContent: 'flex-start' }}>
            <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Feedback'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
