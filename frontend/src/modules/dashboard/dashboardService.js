import { get } from '../../services/api'

export function getDashboard() {
  return get('/public/dashboard')
}

export function getStats() {
  return get('/public/dashboard')
}

export function getMapData() {
  return get('/public/map')
}

export function getRecentActivities() {
  return get('/public/activities')
}

export function getDistributionHeatmap() {
  return get('/public/distribution-heatmap')
}
