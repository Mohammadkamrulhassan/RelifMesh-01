const crypto = require('crypto')

class OtpStore {
  constructor() {
    this.redis = null
    this.fallback = null
    this._init()
  }

  async _init() {
    const env = require('../config/environment')
    if (env.redisUrl && env.redisUrl !== 'redis://localhost:6379') {
      try {
        const Redis = require('ioredis')
        this.redis = new Redis(env.redisUrl, {
          maxRetriesPerRequest: 1,
          retryStrategy: () => null,
          lazyConnect: true,
        })
        await this.redis.connect()
        console.log('[OTP] Using Redis store')
        return
      } catch {
        console.log('[OTP] Redis unavailable — using in-memory fallback')
      }
    }
    this.fallback = new Map()
    console.log('[OTP] Using in-memory store')
  }

  _generateOtp() {
    return crypto.randomInt(100000, 999999).toString()
  }

  _phoneKey(phone) { return `otp:${phone}` }
  _rateKey(phone) { return `rate:otp:${phone}` }
  _attemptKey(phone) { return `attempt:${phone}` }
  _refreshKey(token) { return `refresh:${token}` }

  async sendOtp(phone) {
    if (!this.redis && !this.fallback) await this._init()

    const rateKey = this._rateKey(phone)
    let count
    if (this.redis) {
      count = await this.redis.get(rateKey)
      count = count ? parseInt(count) : 0
    } else {
      const entry = this.fallback.get(rateKey)
      count = entry ? entry.count : 0
    }
    if (count >= 3) {
      const ttl = this.redis
        ? await this.redis.ttl(rateKey)
        : Math.ceil(((this.fallback.get(rateKey) || {}).expiresAt - Date.now()) / 1000)
      const minutes = Math.ceil(ttl / 60)
      return { error: `Too many OTP requests. Try again in ${minutes} min.`, retryAfter: ttl }
    }

    const otp = this._generateOtp()
    const hashed = crypto.createHash('sha256').update(otp).digest('hex')

    const key = this._phoneKey(phone)
    if (this.redis) {
      await this.redis.setex(key, 300, hashed)
      if (count === 0) {
        await this.redis.setex(rateKey, 600, 1)
      } else {
        await this.redis.incr(rateKey)
      }
    } else {
      this.fallback.set(key, { hashed, expiresAt: Date.now() + 300000 })
      const rateEntry = this.fallback.get(rateKey) || { count: 0, expiresAt: Date.now() + 600000 }
      rateEntry.count += 1
      this.fallback.set(rateKey, rateEntry)
    }
    return { otp }
  }

  async verifyOtp(phone, otp) {
    if (!this.redis && !this.fallback) await this._init()

    const attemptKey = this._attemptKey(phone)
    let attempts
    if (this.redis) {
      attempts = await this.redis.get(attemptKey)
      attempts = attempts ? parseInt(attempts) : 0
    } else {
      const entry = this.fallback.get(attemptKey)
      attempts = entry ? entry.count : 0
    }
    if (attempts >= 5) {
      return { error: 'Too many attempts. Phone blocked for 30 min.' }
    }

    const key = this._phoneKey(phone)
    let stored
    if (this.redis) {
      stored = await this.redis.get(key)
    } else {
      const entry = this.fallback.get(key)
      stored = entry && entry.expiresAt > Date.now() ? entry.hashed : null
    }
    if (!stored) return { error: 'OTP expired or not sent. Request a new one.' }

    const hashed = crypto.createHash('sha256').update(otp).digest('hex')
    if (hashed !== stored) {
      if (this.redis) {
        await this.redis.incr(attemptKey)
        await this.redis.expire(attemptKey, 1800)
      } else {
        const entry = this.fallback.get(attemptKey) || { count: 0, expiresAt: Date.now() + 1800000 }
        entry.count += 1
        this.fallback.set(attemptKey, entry)
      }
      const remaining = 4 - attempts
      return { error: `Invalid OTP. ${remaining} attempts remaining.` }
    }

    if (this.redis) {
      await this.redis.del(key)
      await this.redis.del(attemptKey)
    } else {
      this.fallback.delete(key)
      this.fallback.delete(attemptKey)
    }
    return { valid: true }
  }

  async storeRefreshToken(token, phone, ttl = 604800) {
    if (this.redis) {
      await this.redis.setex(this._refreshKey(token), ttl, phone)
    } else {
      this.fallback.set(this._refreshKey(token), { phone, expiresAt: Date.now() + ttl * 1000 })
    }
  }

  async consumeRefreshToken(token) {
    if (this.redis) {
      const phone = await this.redis.get(this._refreshKey(token))
      if (!phone) return null
      await this.redis.del(this._refreshKey(token))
      return phone
    }
    const entry = this.fallback.get(this._refreshKey(token))
    if (!entry || entry.expiresAt < Date.now()) return null
    this.fallback.delete(this._refreshKey(token))
    return entry.phone
  }
}

module.exports = new OtpStore()
