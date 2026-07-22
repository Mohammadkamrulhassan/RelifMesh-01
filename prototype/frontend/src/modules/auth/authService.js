import { post } from '../../services/api'

export function login(email, password) {
  return post('/auth/login', { email, password })
}

export function register(data) {
  return post('/auth/register', data)
}
