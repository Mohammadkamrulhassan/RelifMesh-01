const jwt = require('jsonwebtoken')
const env = require('../config/environment')

function setupSocket(server) {
  let Server
  try {
    Server = require('socket.io').Server
  } catch {
    console.warn('  socket.io not installed — WebSocket unavailable')
    return null
  }
  const io = new Server(server, {
    cors: { origin: env.frontendUrl || '*', methods: ['GET', 'POST'] },
    pingTimeout: 60000,
    pingInterval: 25000,
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Authentication required'))
    try {
      const decoded = jwt.verify(token, env.jwtSecret)
      socket.user = decoded
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    socket.join(`user:${socket.user.sub}`)

    socket.on('sos:subscribe', ({ sosId }) => {
      if (sosId) socket.join(`sos:${sosId}`)
    })
    socket.on('sos:unsubscribe', ({ sosId }) => {
      if (sosId) socket.leave(`sos:${sosId}`)
    })
    socket.on('mission:subscribe', ({ missionId }) => {
      if (missionId) socket.join(`mission:${missionId}`)
    })
    socket.on('mission:unsubscribe', ({ missionId }) => {
      if (missionId) socket.leave(`mission:${missionId}`)
    })
    socket.on('location:update', ({ lat, lng }) => {
      socket.broadcast.emit('location:updated', {
        userId: socket.user.sub, lat, lng,
      })
    })
    socket.on('disconnect', () => {})
  })

  const adminNs = io.of('/admin')
  adminNs.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error('Authentication required'))
    try {
      const decoded = jwt.verify(token, env.jwtSecret)
      if (!['admin', 'super_admin'].includes(decoded.role)) return next(new Error('Forbidden'))
      socket.user = decoded
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })
  adminNs.on('connection', (socket) => {
    socket.join('admin:dashboard')
  })

  return io
}

module.exports = setupSocket
