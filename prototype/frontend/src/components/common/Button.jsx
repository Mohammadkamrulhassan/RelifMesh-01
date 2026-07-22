import { forwardRef } from 'react'

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
  success: 'btn-success',
}

const SIZES = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

const Button = forwardRef(({
  children, variant = 'primary', size = 'md', type = 'button',
  disabled = false, loading = false, fullWidth = false,
  leftIcon = null, rightIcon = null, className = '', onClick, ...rest
}, ref) => {
  const classes = [
    'btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={classes}
      onClick={onClick}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {!loading && leftIcon && <span className="btn-icon btn-icon-left">{leftIcon}</span>}
      <span className="btn-label">{children}</span>
      {!loading && rightIcon && <span className="btn-icon btn-icon-right">{rightIcon}</span>}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
