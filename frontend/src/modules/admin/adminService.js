import { get, put } from '../../services/api'

export function listUsers() {
  return get('/auth/users')
}

export function resolveAlert(id, reason) {
  return put(`/alerts/${id}/resolve`, { reason })
}

export function listAlerts() {
  return get('/alerts')
}
