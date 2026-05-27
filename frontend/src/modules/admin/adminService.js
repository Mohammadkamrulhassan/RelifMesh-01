import { get, put } from '../../services/api'

export function listUsers() {
  return get('/auth/users')
}

export function resolveAlert(id, reason) {
  return put(`/alerts/${id}/resolve`, { overrideReason: reason })
}

export function listAlerts() {
  return get('/alerts')
}
