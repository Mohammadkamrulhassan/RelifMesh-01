const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const User = require('../modules/auth/authModel')
const GeographicArea = require('../modules/areas/areaModel')
const { ItemCategory } = require('../modules/public/publicModel')

const URI_FILE = path.resolve(__dirname, '.mongo-uri')

async function connectDB() {
  if (mongoose.connection.readyState === 1) return
  const uri = fs.readFileSync(URI_FILE, 'utf-8')
  await mongoose.connect(uri)
}

async function seedTestData() {
  await connectDB()
  const existing = await User.countDocuments()
  if (existing > 0) return

  const district = await GeographicArea.create({ name: 'Test District', level: 'DISTRICT' })
  const upazila = await GeographicArea.create({ name: 'Test Upazila', level: 'UPAZILA', parentId: district._id })
  const union = await GeographicArea.create({ name: 'Test Union', level: 'UNION', parentId: upazila._id })
  const ward = await GeographicArea.create({
    name: 'Test Ward 1',
    level: 'WARD',
    parentId: union._id,
    coordinates: { lat: 23.5, lng: 91.2 },
    population: 5000,
  })

  await User.create([
    {
      name: 'Upazila Officer',
      email: 'upazila@test.com',
      passwordHash: await bcrypt.hash('password', 10),
      role: 'UPAZILA_OFFICER',
      jurisdictionId: upazila._id,
    },
    {
      name: 'UP Official',
      email: 'upofficial@test.com',
      passwordHash: await bcrypt.hash('password', 10),
      role: 'UP_OFFICIAL',
      jurisdictionId: union._id,
    },
    {
      name: 'NGO Worker',
      email: 'ngo@test.com',
      passwordHash: await bcrypt.hash('password', 10),
      role: 'NGO_WORKER',
      jurisdictionId: union._id,
      organization: 'BRAC',
    },
  ])

  const riceCat = await ItemCategory.create({ name: 'Rice', per_person_per_day_qty: 0.4, isActive: true })
  await ItemCategory.create({ name: 'Dal', per_person_per_day_qty: 0.1, isActive: true })
  await ItemCategory.create({ name: 'Drinking Water', per_person_per_day_qty: 3, isActive: true })

  return { district, upazila, union, ward, riceCat }
}

async function getToken(role) {
  await connectDB()
  const user = await User.findOne({ role })
  if (!user) throw new Error(`No user found for role: ${role}`)
  return jwt.sign(
    { sub: user._id, role: user.role, jurisdictionId: user.jurisdictionId },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1d' }
  )
}

async function closeDB() {
  await mongoose.disconnect()
}

module.exports = { connectDB, seedTestData, getToken, closeDB }
