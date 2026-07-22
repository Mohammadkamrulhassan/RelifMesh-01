const mongoose = require('mongoose')
const env = require('./environment')

const REQUIRED_COLLECTIONS = ['users', 'jurisdictions', 'households', 'distributionlogs', 'itemcategories', 'duplicatealerts', 'syncconflicts', 'feedbacks', 'inventories']

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
      await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 })
      console.log('[DB] MongoDB connected:', mongoose.connection.host)

      const status = await checkDatabase()

      if (status === 'EMPTY') {
        console.log('[DB] Empty database detected — running seed...')
        await runSeed()
        console.log('[DB] Seed complete.')
      } else if (status === 'INCOMPLETE') {
        console.log('[DB] Database is incomplete — consider re-running seed.')
      } else {
        console.log('[DB] Database is ready.')
      }

      return mongoose.connection
    } catch (err) {
      if (attempt < maxRetries) {
        console.log(`[DB] Connection attempt ${attempt} failed, retrying in 2s...`)
        await new Promise(r => setTimeout(r, 2000))
      } else {
        console.error('[DB] Failed to connect after', maxRetries, 'attempts')
        console.error('[DB] Make sure MongoDB is running at:', env.mongoUri)
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
