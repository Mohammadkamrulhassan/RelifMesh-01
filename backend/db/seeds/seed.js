const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const env = require('../../config/environment')
const User = require('../../modules/auth/authModel')
const Jurisdiction = require('../../modules/public/publicModel').Jurisdiction
const ItemCategory = require('../../modules/public/publicModel').ItemCategory

async function seed() {
  await mongoose.connect(env.mongoUri)
  console.log('Seeding database...')

  const existing = await User.countDocuments()
  if (existing > 0) {
    console.log('Database already seeded, skipping.')
    return mongoose.disconnect()
  }

  const district = await Jurisdiction.create({ name: 'Sylhet', level: 'DISTRICT' })
  const upazila = await Jurisdiction.create({ name: 'Sunamganj Sadar', level: 'UPAZILA', parentId: district._id })
  const union = await Jurisdiction.create({ name: 'Char Fasson', level: 'UNION', parentId: upazila._id })

  const upazilaOfficer = await User.create({
    name: 'Kamal Hossain',
    email: 'upazila@relifmesh.test',
    passwordHash: await bcrypt.hash('password123', 10),
    role: 'UPAZILA_OFFICER',
    jurisdictionId: upazila._id,
  })

  const upOfficial = await User.create({
    name: 'Rahim Uddin',
    email: 'upofficial@relifmesh.test',
    passwordHash: await bcrypt.hash('password123', 10),
    role: 'UP_OFFICIAL',
    jurisdictionId: union._id,
  })

  await ItemCategory.create([
    { name: 'Rice', parentCategoryId: null },
    { name: 'Dal', parentCategoryId: null },
    { name: 'Drinking Water', parentCategoryId: null },
    { name: 'Tarp', parentCategoryId: null },
    { name: 'Blanket', parentCategoryId: null },
  ])

  console.log('Seed complete.')
  console.log('Test accounts:')
  console.log(`  UPAZILA_OFFICER: upazila@relifmesh.test / password123`)
  console.log(`  UP_OFFICIAL:     upofficial@relifmesh.test / password123`)
  mongoose.disconnect()
}

seed().catch(err => { console.error(err); process.exit(1) })
