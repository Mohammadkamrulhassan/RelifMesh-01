export default function InputField({ label, name, error, type = 'text', className = '', ...props }) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={name} className="input-label">{label}</label>}
      <div className={`input-wrapper ${error ? 'input-error-state' : ''}`}>
        <input
          id={name}
          name={name}
          type={type}
          className="input-field"
          {...props}
        />
      </div>
      {error && <p className="input-error-text">{error}</p>}
    </div>
  )
}
