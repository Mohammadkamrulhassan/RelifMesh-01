import { get, put } from '../../services/api'

export function listUsers(params = '') {
  return get(`/auth/users${params}`)
}

export function resolveAlert(id, reason) {
  return put(`/alerts/${id}/resolve`, { reason })
}

export function listAlerts() {
  return get('/alerts')
}
