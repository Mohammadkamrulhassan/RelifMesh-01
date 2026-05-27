const mongoose = require('mongoose')
const env = require('./environment')

async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri)
    console.log('MongoDB connected:', mongoose.connection.host)
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
