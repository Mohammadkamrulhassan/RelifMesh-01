import { get } from '../../services/api'

const BASE = import.meta.env.VITE_API_BASE_URL || '/v1'

export function getExportUrl(format = 'csv', filters = {}) {
  const params = new URLSearchParams({ format, ...filters }).toString()
  const token = localStorage.getItem('token')
  return `${BASE}/reports/export?${params}` + (token ? `&token=${token}` : '')
}

export async function triggerExport(format = 'csv', filters = {}) {
  const token = localStorage.getItem('token')
  const params = new URLSearchParams({ format, ...filters }).toString()
  const res = await fetch(`${BASE}/reports/export?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Export failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reliefmesh-report.${format}`
  a.click()
  URL.revokeObjectURL(url)
}
