export default function InputField({ label, name, error, type = 'text', className = '', ...props }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
