import { get, post, put } from '../../services/api'

export function listHouseholds() {
  return get('/households')
}

export function getHousehold(id) {
  return get(`/households/${id}`)
}

export function createHousehold(data) {
  return post('/households', data)
}

export function updateHousehold(id, data) {
  return put(`/households/${id}`, data)
}

export function searchHouseholds(q) {
  return get(`/households/search?q=${encodeURIComponent(q)}`)
}
