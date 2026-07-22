const fs = require('fs')
const path = require('path')

const URI_FILE = path.resolve(__dirname, '.mongo-uri')

module.exports = async function () {
  if (global.__MONGO_SERVER__) {
    await global.__MONGO_SERVER__.stop()
  }
  if (fs.existsSync(URI_FILE)) {
    fs.unlinkSync(URI_FILE)
  }
}
