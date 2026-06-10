const dotenv = require('dotenv')
const { URL } = require('url')
dotenv.config()

function ensureDatabaseName(uri, defaultDb = 'relifmesh') {
  if (!uri || uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) {
    try {
      const u = new URL(uri.replace(/^mongodb\+srv:\/\//, 'https://'))
      if (!u.pathname || u.pathname === '/' || u.pathname === '') {
        return uri + '/' + defaultDb
      }
    } catch {
      // fall through if URL parsing fails
    }
  }
  return uri
}

const rawUri = process.env.MONGODB_URI || ''
const mongoUri = ensureDatabaseName(rawUri) || 'mongodb://localhost:27017/relifmesh'

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri,
  isAtlas: mongoUri.startsWith('mongodb+srv://'),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  smsProvider: process.env.SMS_PROVIDER || 'mock',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
}

module.exports = env
