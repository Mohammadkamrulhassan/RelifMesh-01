const express = require('express')
const path = require('path')
const cors = require('cors')
const helmet = require('helmet')
const os = require('os')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/database')
const env = require('./config/environment')
const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./modules/auth/authRoutes')
const householdRoutes = require('./modules/households/householdRoutes')
const distributionRoutes = require('./modules/distributions/distributionRoutes')
const alertRoutes = require('./modules/alerts/alertRoutes')
const reportRoutes = require('./modules/reports/reportRoutes')
const publicRoutes = require('./modules/public/publicRoutes')
const syncRoutes = require('./modules/sync/syncRoutes')
const uploadRoutes = require('./modules/upload/uploadRoutes')
const feedbackRoutes = require('./modules/feedback/feedbackRoutes')
const inventoryRoutes = require('./modules/inventory/inventoryRoutes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

app.use('/v1/auth', authRoutes)
app.use('/v1/households', householdRoutes)
app.use('/v1/distributions', distributionRoutes)
app.use('/v1/alerts', alertRoutes)
app.use('/v1/reports', reportRoutes)
app.use('/v1/public', publicRoutes)
app.use('/v1/sync', syncRoutes)
app.use('/v1/uploads', uploadRoutes)
app.use('/v1/feedback', feedbackRoutes)
app.use('/v1/inventory', inventoryRoutes)

app.get('/v1/health', (req, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

function getNetworkIP() {
  const ifaces = os.networkInterfaces()
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address
    }
  }
  return 'localhost'
}

connectDB().then(() => {
  app.listen(env.port, () => {
    const local = `http://localhost:${env.port}`
    const network = `http://${getNetworkIP()}:${env.port}`
    console.log()
    console.log('  RelifMesh API is running')
    console.log('  ──────────────────────')
    console.log(`  Local:   ${local}`)
    console.log(`  Network: ${network}`)
    console.log(`  Health:  ${local}/v1/health`)
    console.log()
  })
})

module.exports = app
