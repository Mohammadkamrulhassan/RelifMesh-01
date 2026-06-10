import { get, post, put, del } from '../../services/api'

export function listDistributions(filters = {}) {
  const params = new URLSearchParams(filters).toString()
  return get(`/distributions${params ? '?' + params : ''}`)
}

export function getDistribution(id) {
  return get(`/distributions/${id}`)
}

export function createDistribution(data) {
  return post('/distributions', data)
}

export function updateDistribution(id, data) {
  return put(`/distributions/${id}`, data)
}

export function deleteDistribution(id) {
  return del(`/distributions/${id}`)
}

export function duplicateCheck(householdId, itemCategoryId) {
  return get(`/distributions/duplicate-check?householdId=${householdId}&itemCategoryId=${itemCategoryId}`)
}

export function listCategories() {
  return get('/public/item-categories')
}
