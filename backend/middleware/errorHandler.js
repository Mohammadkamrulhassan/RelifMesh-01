function errorHandler(err, req, res, next) {
  console.error(err)
  const status = err.status || 500
  let message = err.message || 'Internal server error'
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    message = `Duplicate ${field}`
  }
  res.status(status).json({ error: message, message })
}

module.exports = errorHandler
