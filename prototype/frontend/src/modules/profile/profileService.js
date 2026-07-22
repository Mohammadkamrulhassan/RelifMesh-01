import { get, put } from '../../services/api'

export function getProfile() {
  return get('/auth/profile')
}

export function updateProfile(data) {
  return put('/auth/profile', data)
}
