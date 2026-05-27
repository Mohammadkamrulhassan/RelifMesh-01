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
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
      <div className="flex items-center gap-4">
        {preview && (
          <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
        )}
        <button type="button" className="btn-secondary text-sm" onClick={() => inputRef.current?.click()}>
          {preview ? 'Change Photo' : 'Capture Photo'}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} />
    </div>
  )
}
