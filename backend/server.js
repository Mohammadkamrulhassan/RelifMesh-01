const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
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

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

app.use('/v1/auth', authRoutes)
app.use('/v1/households', householdRoutes)
app.use('/v1/distributions', distributionRoutes)
app.use('/v1/alerts', alertRoutes)
app.use('/v1/reports', reportRoutes)
app.use('/v1/public', publicRoutes)
app.use('/v1/sync', syncRoutes)

app.get('/v1/health', (req, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

connectDB().then(() => {
  app.listen(env.port, () => {
    console.log(`RelifMesh API running on port ${env.port}`)
  })
})

module.exports = app
