const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../auth/authModel')
const env = require('../../config/environment')
const otpStore = require('../../services/otpStore')

async function sendOtp(req, res, next) {
  try {
    const { phone } = req.body
    const result = await otpStore.sendOtp(phone)
    if (result.error) {
      return res.status(429).json({ error: result.error, retryAfter: result.retryAfter })
    }
    const masked = phone.slice(0, 4) + '****' + phone.slice(-2)
    res.json({
      message: `OTP sent to ${masked}`,
      otp: env.nodeEnv === 'development' ? result.otp : undefined,
    })
  } catch (err) { next(err) }
}

async function verifyOtp(req, res, next) {
  try {
    const { phone, otp } = req.body
    const result = await otpStore.verifyOtp(phone, otp)
    if (result.error) {
      return res.status(401).json({ error: result.error })
    }
    let user = await User.findOne({ phone })
    if (!user) {
      user = await User.create({
        name: `User ${phone.slice(-4)}`,
        phone,
        role: 'victim',
        isVerified: true,
      })
    } else {
      await User.findByIdAndUpdate(user._id, { isVerified: true })
    }
    const accessToken = jwt.sign(
      { sub: user._id, role: user.role, phone: user.phone },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn || '15m' },
    )
    const refreshToken = jwt.sign(
      { sub: user._id, type: 'refresh' },
      env.jwtRefreshSecret,
      { expiresIn: env.jwtRefreshExpiresIn || '7d' },
    )
    await otpStore.storeRefreshToken(refreshToken, phone)
    res.json({ accessToken, refreshToken, user })
  } catch (err) { next(err) }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' })
    const phone = await otpStore.consumeRefreshToken(refreshToken)
    if (!phone) return res.status(401).json({ error: 'Invalid or expired refresh token' })
    let decoded
    try {
      decoded = jwt.verify(refreshToken, env.jwtRefreshSecret)
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }
    const user = await User.findById(decoded.sub)
    if (!user) return res.status(404).json({ error: 'User not found' })
    const newAccess = jwt.sign(
      { sub: user._id, role: user.role, phone: user.phone },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn || '15m' },
    )
    const newRefresh = jwt.sign(
      { sub: user._id, type: 'refresh' },
      env.jwtRefreshSecret,
      { expiresIn: env.jwtRefreshExpiresIn || '7d' },
    )
    await otpStore.storeRefreshToken(newRefresh, phone)
    res.json({ accessToken: newAccess, refreshToken: newRefresh })
  } catch (err) { next(err) }
}

module.exports = { sendOtp, verifyOtp, refresh }
