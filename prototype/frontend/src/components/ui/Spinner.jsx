export default function Spinner({ size = 20, className = '' }) {
  return (
    <span
      className={className}
      style={{
        width: size, height: size,
        border: '2px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'btn-spin 0.6s linear infinite',
        display: 'inline-block',
      }}
      aria-hidden="true"
    />
  )
}
