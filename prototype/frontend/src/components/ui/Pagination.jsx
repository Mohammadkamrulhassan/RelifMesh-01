export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null

  const getPages = () => {
    const items = []
    const maxVisible = 5
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    let end = Math.min(pages, start + maxVisible - 1)
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) {
      items.push(i)
    }
    return items
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      gap: 'var(--space-2)', marginTop: 'var(--space-6)',
    }}>
      <button
        className="btn btn-ghost btn-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>
      {getPages().map(p => (
        <button
          key={p}
          className={`btn ${p === page ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button
        className="btn btn-ghost btn-sm"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next ›
      </button>
    </div>
  )
}
