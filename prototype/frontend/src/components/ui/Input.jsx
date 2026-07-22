import { forwardRef, useState } from 'react'

const Input = forwardRef(({
  label, name, type = 'text', placeholder = '', value, defaultValue,
  onChange, onBlur, onFocus, error, hint, disabled = false, required = false,
  readOnly = false, leftIcon = null, rightIcon = null, className = '',
  inputClassName = '', ...rest
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className={[
        'input-wrapper',
        isFocused ? 'input-focused' : '',
        error ? 'input-error-state' : '',
        disabled ? 'input-disabled-state' : '',
      ].filter(Boolean).join(' ')}>
        {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={(e) => { setIsFocused(true); onFocus?.(e) }}
          onBlur={(e) => { setIsFocused(false); onBlur?.(e) }}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
          className={`input-field ${leftIcon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''} ${inputClassName}`}
          {...rest}
        />
        {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
      </div>
      {error && <p id={`${name}-error`} className="input-error-text" role="alert">{error}</p>}
      {!error && hint && <p id={`${name}-hint`} className="input-hint-text">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
