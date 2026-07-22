import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { post } from '../services/api'
import { getToken, setToken, getStoredUser, setStoredUser, clearAuth } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser())
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { token, user: u } = await post('/auth/login', { email, password })
      setToken(token)
      setStoredUser(u)
      setUser(u)
      return u
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
  }, [])

  const setAuth = useCallback((u, token) => {
    if (token) setToken(token)
    setStoredUser(u)
    setUser(u)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
