import { get, post } from '../../services/api'

export function listDistributions(filters = {}) {
  const params = new URLSearchParams(filters).toString()
  return get(`/distributions${params ? '?' + params : ''}`)
}

export function createDistribution(data) {
  return post('/distributions', data)
}

export function duplicateCheck(householdId, itemCategoryId) {
  return get(`/distributions/duplicate-check?householdId=${householdId}&itemCategoryId=${itemCategoryId}`)
}
