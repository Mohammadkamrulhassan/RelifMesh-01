import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div style={{
          position: 'fixed', top: 'var(--space-4)', right: 'var(--space-4)',
          zIndex: 'var(--z-toast)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
          maxWidth: '400px',
        }}>
          {toasts.map(t => (
            <div key={t.id} className={`badge badge-${t.type === 'error' ? 'danger' : t.type === 'success' ? 'success' : t.type === 'warning' ? 'warning' : 'info'}`}
              style={{
                padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem',
                cursor: 'pointer', boxShadow: 'var(--shadow-lg)', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)',
              }}
              onClick={() => removeToast(t.id)}
              role="alert"
            >
              <span>{t.message}</span>
              <span style={{ cursor: 'pointer', fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>×</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
