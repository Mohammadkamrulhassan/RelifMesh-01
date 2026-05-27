export function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function isNID(v) {
  return /^\d{10}$/.test(v) || /^\d{17}$/.test(v)
}

export function isRequired(v) {
  return v != null && String(v).trim() !== ''
}

export function minLength(n) {
  return v => v && v.length >= n
}

export function isPositiveNumber(v) {
  const n = Number(v)
  return !isNaN(n) && n > 0
}

export function isLatitude(v) {
  const n = Number(v)
  return !isNaN(n) && n >= -90 && n <= 90
}

export function isLongitude(v) {
  const n = Number(v)
  return !isNaN(n) && n >= -180 && n <= 180
}

export function validate(fields, values) {
  const errors = {}
  for (const [name, rules] of Object.entries(fields)) {
    for (const rule of rules) {
      const error = rule(values[name])
      if (error !== true) {
        errors[name] = error
        break
      }
    }
  }
  return errors
}

export function isDate(v) {
  return v != null && !isNaN(new Date(v).getTime())
}
