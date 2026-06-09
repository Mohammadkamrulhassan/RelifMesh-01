import { useRef, useState } from 'react'

export default function PhotoCapture({ onCapture, currentUrl }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(currentUrl || null)

  function handleChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
      if (onCapture) onCapture(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <p className="input-label" style={{ marginBottom: 'var(--space-2)' }}>Photo</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        {preview && (
          <img src={preview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
        )}
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => inputRef.current?.click()}>
          {preview ? 'Change Photo' : 'Capture Photo'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleChange} />
    </div>
  )
}
