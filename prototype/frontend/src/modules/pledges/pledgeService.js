import { get, post, put, del } from '../../services/api'

export function listPledges(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return get(`/pledges${qs ? '?' + qs : ''}`)
}

export function getPledge(id) {
  return get(`/pledges/${id}`)
}

export function createPledge(data) {
  return post('/pledges', data)
}

export function updatePledge(id, data) {
  return put(`/pledges/${id}`, data)
}

export function updatePledgeStatus(id, status) {
  return put(`/pledges/${id}/status`, { status })
}

export function deletePledge(id) {
  return del(`/pledges/${id}`)
}

export function getMyPledges() {
  return get('/pledges/my')
}

export function listCategories() {
  return get('/public/item-categories')
}

export function listAreas(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return get(`/areas${qs ? '?' + qs : ''}`)
}
