import { get, post, put } from '../../services/api'

export function listMyRequests(params = '') {
  return get(`/relief-requests/mine${params}`)
}

export function getRequest(id) {
  return get(`/relief-requests/mine/${id}`)
}

export function createRequest(data) {
  return post('/relief-requests', data)
}

export function cancelRequest(id) {
  return put(`/relief-requests/mine/${id}/cancel`)
}

export function listAllRequests(params = '') {
  return get(`/relief-requests/admin${params}`)
}

export function reviewRequest(id, data) {
  return put(`/relief-requests/admin/${id}/review`, data)
}

export function listCategories() {
  return get('/public/item-categories')
}
