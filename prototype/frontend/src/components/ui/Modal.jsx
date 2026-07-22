import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

const SIZES = { sm: 'modal-sm', md: 'modal-md', lg: 'modal-lg', xl: 'modal-xl', full: 'modal-full' }

export default function Modal({
  isOpen, onClose, title, children, size = 'md',
  closeOnOverlay = true, closeOnEsc = true, showCloseButton = true,
  footer = null, className = '',
}) {
  const modalRef = useRef(null)
  const previousFocus = useRef(null)

  const handleClose = useCallback(() => { onClose?.() }, [onClose])

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) handleClose()
  }

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEsc) handleClose()
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first)?.focus()
      }
    }
  }, [closeOnEsc, handleClose])

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
      setTimeout(() => modalRef.current?.focus(), 10)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
      <div ref={modalRef} tabIndex={-1} className={`modal-container ${SIZES[size] || SIZES.md} ${className}`}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">✕</button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}
