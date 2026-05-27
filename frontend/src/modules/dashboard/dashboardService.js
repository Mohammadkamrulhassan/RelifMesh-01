import { get } from '../../services/api'

export function getDashboard() {
  return get('/public/dashboard')
}

export function getMapData() {
  return get('/public/map')
}
