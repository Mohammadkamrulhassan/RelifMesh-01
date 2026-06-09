import Spinner from '../ui/Spinner'

export default function Loading({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 0',
      gap: 'var(--space-3)',
    }}>
      <Spinner size={32} />
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{message}</p>
    </div>
  )
}
