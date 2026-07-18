const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const env = require('../../config/environment')
const User = require('../../modules/auth/authModel')
const { ItemCategory } = require('../../modules/public/publicModel')
const GeographicArea = require('../../modules/areas/areaModel')

async function seed() {
  const needsConnection = mongoose.connection.readyState !== 1
  if (needsConnection) {
    await mongoose.connect(env.mongoUri)
  }

  const existing = await User.countDocuments()
  if (existing > 0) {
    console.log('[Seed] Database already has data — skipping.')
    if (needsConnection) await mongoose.disconnect()
    return
  }

  console.log('[Seed] Seeding database...')

  const district = await GeographicArea.create({ name: 'Sylhet', level: 'DISTRICT' })
  const upazila = await GeographicArea.create({ name: 'Sunamganj Sadar', level: 'UPAZILA', parentId: district._id })
  const union = await GeographicArea.create({ name: 'Char Fasson', level: 'UNION', parentId: upazila._id })

  await User.create([
    {
      name: 'Kamal Hossain',
      email: 'upazila@reliefmesh.test',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'UPAZILA_OFFICER',
      jurisdictionId: upazila._id,
    },
    {
      name: 'Rahim Uddin',
      email: 'upofficial@reliefmesh.test',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'UP_OFFICIAL',
      jurisdictionId: union._id,
    },
    {
      name: 'Nasrin Akter',
      email: 'ngo@reliefmesh.test',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'NGO_WORKER',
      jurisdictionId: union._id,
      organization: 'BRAC',
    },
    {
      name: 'Jamil Hassan',
      email: 'citizen@reliefmesh.test',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'CITIZEN',
      phone: '01712345678',
      address: 'Char Fasson, Sunamganj',
    },
  ])

  await ItemCategory.create([
    { name: 'Rice' },
    { name: 'Dal' },
    { name: 'Drinking Water' },
    { name: 'Tarp' },
    { name: 'Blanket' },
  ])

  console.log('[Seed] Done.')
  console.log('[Seed] Test accounts:')
  console.log('  upazila@reliefmesh.test / password123  (UPAZILA_OFFICER)')
  console.log('  upofficial@reliefmesh.test / password123 (UP_OFFICIAL)')
  console.log('  ngo@reliefmesh.test / password123       (NGO_WORKER)')
  console.log('  citizen@reliefmesh.test / password123   (CITIZEN)')

  if (needsConnection) await mongoose.disconnect()
}

if (require.main === module) {
  seed().catch(err => { console.error(err); process.exit(1) })
}

module.exports = seed
