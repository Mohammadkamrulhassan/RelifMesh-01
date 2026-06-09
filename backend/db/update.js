const mongoose = require('mongoose')
const env = require('../config/environment')

async function updateDatabase() {
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 })
    const db = mongoose.connection.db
    const collections = (await db.listCollections().toArray()).map(c => c.name)

    console.log('Connected to:', mongoose.connection.host)
    console.log('Database   :', mongoose.connection.db.databaseName)
    console.log('')

    const operations = []

    if (!collections.includes('users')) {
      console.log('  [CREATE] users collection')
      await db.createCollection('users')
      operations.push('users')
    }

    if (!collections.includes('jurisdictions')) {
      console.log('  [CREATE] jurisdictions collection')
      await db.createCollection('jurisdictions')
      operations.push('jurisdictions')
    }

    if (!collections.includes('households')) {
      console.log('  [CREATE] households collection')
      await db.createCollection('households')
      operations.push('households')
    }

    if (!collections.includes('distributionlogs')) {
      console.log('  [CREATE] distributionlogs collection')
      await db.createCollection('distributionlogs')
      operations.push('distributionlogs')
    }

    if (!collections.includes('itemcategories')) {
      console.log('  [CREATE] itemcategories collection')
      await db.createCollection('itemcategories')
      operations.push('itemcategories')
    }

    if (!collections.includes('duplicatealerts')) {
      console.log('  [CREATE] duplicatealerts collection')
      await db.createCollection('duplicatealerts')
      operations.push('duplicatealerts')
    }

    if (!collections.includes('syncconflicts')) {
      console.log('  [CREATE] syncconflicts collection')
      await db.createCollection('syncconflicts')
      operations.push('syncconflicts')
    }

    if (!collections.includes('feedbacks')) {
      console.log('  [CREATE] feedbacks collection')
      await db.createCollection('feedbacks')
      operations.push('feedbacks')
    }

    if (!collections.includes('inventories')) {
      console.log('  [CREATE] inventories collection')
      await db.createCollection('inventories')
      operations.push('inventories')
    }

    if (operations.length > 0) {
      console.log('\nCreated', operations.length, 'missing collection(s).')
      console.log('Run  npm run seed  to populate with test data.')
    } else {
      console.log('All collections already exist. Nothing to update.')
    }

    await mongoose.disconnect()
  } catch (err) {
    console.error('ERROR:', err.message)
    process.exit(1)
  }
}

updateDatabase()
