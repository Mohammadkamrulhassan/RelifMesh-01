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

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.sub).populate('jurisdictionId')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) { next(err) }
}

async function updateProfile(req, res, next) {
  try {
    const { name, organization } = req.body
    const updates = {}
    if (name) updates.name = name
    if (organization !== undefined) updates.organization = organization
    const user = await User.findByIdAndUpdate(req.user.sub, updates, { new: true })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) { next(err) }
}

async function listUsers(req, res, next) {
  try {
    const filter = { jurisdictionId: req.user.jurisdictionId }
    const users = await User.find(filter).sort({ createdAt: -1 })
    res.json({ users })
  } catch (err) { next(err) }
}

module.exports = { login, register, getProfile, updateProfile, listUsers }
