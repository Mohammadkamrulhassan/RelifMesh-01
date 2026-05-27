const mongoose = require('mongoose')
const env = require('../config/environment')

const REQUIRED_COLLECTIONS = [
  'users', 'jurisdictions', 'households',
  'distributionlogs', 'itemcategories', 'duplicatealerts', 'syncconflicts'
]

async function showStatus() {
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 })
    const db = mongoose.connection.db

    const collections = await db.listCollections().toArray()
    const names = collections.map(c => c.name)

    console.log('MongoDB  :', mongoose.connection.host)
    console.log('Database :', mongoose.connection.db.databaseName)
    console.log('')

    if (names.length === 0) {
      console.log('Status: EMPTY — no collections exist.')
      console.log('Run  npm run seed  to initialize the database.')
      await mongoose.disconnect()
      return
    }

    console.log('Collections:')
    for (const name of REQUIRED_COLLECTIONS) {
      const exists = names.includes(name)
      const count = exists ? await db.collection(name).countDocuments() : 0
      const icon = exists ? '[x]' : '[ ]'
      console.log(`  ${icon} ${name}  (${count} documents)`)
    }

    const missing = REQUIRED_COLLECTIONS.filter(c => !names.includes(c))
    if (missing.length > 0) {
      console.log('\nMissing collections:', missing.join(', '))
      console.log('Run  npm run seed  to initialize missing data.')
    } else {
      console.log('\nStatus: READY')
    }

    await mongoose.disconnect()
  } catch (err) {
    console.error('ERROR: Could not connect to MongoDB')
    console.error('  ', err.message)
    console.error('  Make sure MongoDB is running at:', env.mongoUri)
    process.exit(1)
  }
}

showStatus()
