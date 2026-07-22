export default function SelectField({ label, name, error, className = '', children, ...props }) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={name} className="input-label">{label}</label>}
      <div className={`input-wrapper ${error ? 'input-error-state' : ''}`}>
        <select id={name} name={name} className="input-field" style={{ appearance: 'auto' }} {...props}>
          {children}
        </select>
      </div>
      {error && <p className="input-error-text">{error}</p>}
    </div>
  )
}
