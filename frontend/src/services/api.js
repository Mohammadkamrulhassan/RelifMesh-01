const BASE = import.meta.env.VITE_API_BASE_URL || '/v1'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw { status: res.status, ...data }
  return data
}

export function get(endpoint) {
  return request(endpoint)
}

export function post(endpoint, body) {
  return request(endpoint, { method: 'POST', body: JSON.stringify(body) })
}

export function put(endpoint, body) {
  return request(endpoint, { method: 'PUT', body: JSON.stringify(body) })
}

export function del(endpoint) {
  return request(endpoint, { method: 'DELETE' })
}
