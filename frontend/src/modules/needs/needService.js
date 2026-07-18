import { get, post, put } from '../../services/api'

export function listNeeds(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return get(`/need${qs ? '?' + qs : ''}`)
}

export function getNeedSummary() {
  return get('/need/summary')
}

export function getNeedHeatmap(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return get(`/need/heatmap${qs ? '?' + qs : ''}`)
}

export function calculateNeeds(areaId, coverageDays = 7) {
  return post('/need/calculate', { areaId, coverageDays })
}

export function overrideNeed(id, override_qty, override_reason) {
  return put(`/need/${id}/override`, { override_qty, override_reason })
}

export function listAreas(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return get(`/areas${qs ? '?' + qs : ''}`)
}

export function getAreaHierarchy() {
  return get('/areas/hierarchy')
}

export function getAreaChildren(id) {
  return get(`/areas/${id}/children`)
}
