const mongoose = require('mongoose')
const env = require('./environment')

const REQUIRED_COLLECTIONS = [
  'users', 'jurisdictions', 'households', 'distributionlogs',
  'itemcategories', 'duplicatealerts', 'syncconflicts',
  'feedbacks', 'inventories', 'reliefrequests',
]

function getMongooseOptions() {
  const opts = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  }
  if (env.isAtlas) {
    opts.retryWrites = true
    opts.w = 'majority'
    opts.appName = 'reliefmesh'
  }
  return opts
}

async function checkDatabase() {
  const db = mongoose.connection.db
  if (!db) throw new Error('No database connection')

  const existing = (await db.listCollections().toArray()).map(c => c.name.toLowerCase())
  const missing = REQUIRED_COLLECTIONS.filter(c => !existing.includes(c))

  if (missing.length === REQUIRED_COLLECTIONS.length) {
    console.log('[DB] No collections found — database is empty')
    return 'EMPTY'
  }
  if (missing.length > 0) {
    console.log('[DB] Missing collections:', missing.join(', '))
    return 'INCOMPLETE'
  }

  const counts = {}
  for (const name of REQUIRED_COLLECTIONS) {
    counts[name] = await db.collection(name).countDocuments()
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  console.log('[DB] Collections found:', counts)
  if (total === 0) return 'EMPTY'
  return 'READY'
}

async function connectDB() {
  const maxRetries = 3
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const opts = getMongooseOptions()
      await mongoose.connect(env.mongoUri, opts)
      console.log('[DB] MongoDB connected:', mongoose.connection.host)
      console.log('[DB] Database:', mongoose.connection.db.databaseName)

      if (env.isAtlas) {
        console.log('[DB] Using MongoDB Atlas — ensure the cluster IP whitelist includes your app IP (0.0.0.0/0 for dev)')
      }

      const status = await checkDatabase()

      if (status === 'EMPTY') {
        console.log('[DB] Empty database detected — running seed...')
        await runSeed()
        console.log('[DB] Seed complete.')
      } else if (status === 'INCOMPLETE') {
        console.log('[DB] Database is incomplete — consider re-running seed via: npm run seed')
      } else {
        console.log('[DB] Database is ready.')
      }

      return mongoose.connection
    } catch (err) {
      if (attempt < maxRetries) {
        console.log(`[DB] Connection attempt ${attempt} failed, retrying in 3s...`)
        if (env.isAtlas) {
          console.log('[DB]   Tip: Verify your Atlas IP whitelist includes 0.0.0.0/0 or your current IP')
        }
        await new Promise(r => setTimeout(r, 3000))
      } else {
        console.error('[DB] Failed to connect after', maxRetries, 'attempts')
        console.error('[DB] URI:', env.mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//<user>:<pass>@'))
        console.error('[DB] Make sure MongoDB is running or Atlas cluster is accessible')
        process.exit(1)
      }
    }
  }
}

async function runSeed() {
  try {
    await require('../db/seeds/seed')()
  } catch (err) {
    console.error('[DB] Seed failed:', err.message)
  }
}

module.exports = connectDB