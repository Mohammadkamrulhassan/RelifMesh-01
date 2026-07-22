import { useState, useEffect } from 'react'
import { get, put } from '../../services/api'
import { formatDateTime } from '../../utils/formatters'
import { useToast } from '../../components/ui/Toast'
import Pagination from '../../components/ui/Pagination'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import Button from '../../components/common/Button'
import Input from '../../components/ui/Input'

export default function FeedbackList() {
  const { addToast } = useToast()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [respondId, setRespondId] = useState(null)
  const [response, setResponse] = useState('')

  useEffect(() => {
    setLoading(true)
    get(`/feedback?page=${page}&limit=20`)
      .then(data => {
        setFeedbacks(data.feedbacks)
        setTotalPages(data.pages)
      })
      .catch(() => addToast('Failed to load feedback', 'error'))
      .finally(() => setLoading(false))
  }, [page])

  async function handleRespond(id) {
    try {
      await put(`/feedback/${id}/respond`, { response })
      setFeedbacks(f => f.map(fb => fb._id === id ? { ...fb, isRead: true, response } : fb))
      setRespondId(null)
      setResponse('')
      addToast('Response sent', 'success')
    } catch {
      addToast('Failed to send response', 'error')
    }
  }

  if (loading) return <Loading message="Loading feedback..." />

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Feedback</h1>
          <p className="page-header-subtitle">{feedbacks.length} entries</p>
        </div>
      </div>
      {feedbacks.length === 0 ? (
        <Card><p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '32px 0' }}>No feedback yet.</p></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {feedbacks.map(fb => (
            <Card key={fb._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{fb.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <span className={`badge badge-${fb.category === 'COMPLAINT' ? 'danger' : fb.category === 'SUGGESTION' ? 'info' : 'neutral'}`} style={{ marginRight: 'var(--space-2)' }}>
                      {fb.category}
                    </span>
                    {formatDateTime(fb.createdAt)}
                  </p>
                </div>
                {!fb.isRead && <span className="badge badge-warning">New</span>}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>{fb.message}</p>
              {fb.response && (
                <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginBottom: 'var(--space-2)' }}>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Response:</p>
                  <p style={{ color: 'var(--color-text-primary)' }}>{fb.response}</p>
                </div>
              )}
              {respondId === fb._id ? (
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <div style={{ flex: 1 }}>
                    <Input name="response" placeholder="Write response..." value={response} onChange={e => setResponse(e.target.value)} />
                  </div>
                  <Button onClick={() => handleRespond(fb._id)} disabled={!response}>Send</Button>
                  <Button variant="ghost" onClick={() => setRespondId(null)}>Cancel</Button>
                </div>
              ) : !fb.response && (
                <Button variant="secondary" size="sm" onClick={() => setRespondId(fb._id)}>Respond</Button>
              )}
            </Card>
          ))}
        </div>
      )}
      <Pagination page={page} pages={totalPages} onPageChange={setPage} />
    </div>
  )
}
