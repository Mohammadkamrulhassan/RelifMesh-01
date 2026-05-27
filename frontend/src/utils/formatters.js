export function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-BD', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function formatDateTime(date) {
  if (!date) return ''
  return new Date(date).toLocaleString('en-BD', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function roleLabel(role) {
  const labels = {
    UP_OFFICIAL: 'Union Parishad Official',
    UPAZILA_OFFICER: 'Upazila Officer',
    NGO_WORKER: 'NGO Worker',
  }
  return labels[role] || role
}

export function truncate(str, len = 50) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}
