const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./authModel')
const env = require('../../config/environment')

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign(
      { sub: user._id, role: user.role, jurisdictionId: user.jurisdictionId },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    )
    res.json({ token, user })
  } catch (err) { next(err) }
}

async function register(req, res, next) {
  try {
    const { name, email, password, role, organization, jurisdictionId } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, role, organization, jurisdictionId })
    res.status(201).json({ user })
  } catch (err) { next(err) }
}

module.exports = { login, register }
