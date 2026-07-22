const { MongoMemoryServer } = require('mongodb-memory-server')
const fs = require('fs')
const path = require('path')

const URI_FILE = path.resolve(__dirname, '.mongo-uri')

module.exports = async function () {
  const mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  fs.writeFileSync(URI_FILE, uri)
  process.env.MONGODB_URI = uri
  process.env.JWT_SECRET = 'test-secret'
  process.env.JWT_EXPIRES_IN = '1d'
  global.__MONGO_SERVER__ = mongoServer
}
