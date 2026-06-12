const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const env = require('../../config/environment')
const User = require('../../modules/auth/authModel')
const { Jurisdiction, ItemCategory } = require('../../modules/public/publicModel')

const TEST_OTP = '123456'

const seed = async () => {
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

  // ── Jurisdictions (v1 + v2) ──────────────────────────────────
  const districtDhaka = await Jurisdiction.create({ name: 'Dhaka', level: 'DISTRICT' })
  const upazilaDhaka = await Jurisdiction.create({ name: 'Dhaka Sadar', level: 'UPAZILA', parentId: districtDhaka._id })
  const unionMirpur = await Jurisdiction.create({ name: 'Mirpur', level: 'UNION', parentId: upazilaDhaka._id })

  const districtSylhet = await Jurisdiction.create({ name: 'Sylhet', level: 'DISTRICT' })
  const upazilaSunamganj = await Jurisdiction.create({ name: 'Sunamganj Sadar', level: 'UPAZILA', parentId: districtSylhet._id })
  const unionCharFasson = await Jurisdiction.create({ name: 'Char Fasson', level: 'UNION', parentId: upazilaSunamganj._id })
  const upazilaSylhetSadar = await Jurisdiction.create({ name: 'Sylhet Sadar', level: 'UPAZILA', parentId: districtSylhet._id })
  const unionShahporan = await Jurisdiction.create({ name: 'Shahporan', level: 'UNION', parentId: upazilaSylhetSadar._id })

  // ── v1 Users (email/password — backward compat) ──────────────
  const v1PasswordHash = await bcrypt.hash('password123', 10)
  await User.create([
    {
      name: 'Kamal Hossain',
      email: 'upazila@relifmesh.test',
      passwordHash: v1PasswordHash,
      role: 'UPAZILA_OFFICER',
      jurisdictionId: upazilaSunamganj._id,
    },
    {
      name: 'Rahim Uddin',
      email: 'upofficial@relifmesh.test',
      passwordHash: v1PasswordHash,
      role: 'UP_OFFICIAL',
      jurisdictionId: unionCharFasson._id,
    },
    {
      name: 'Nasrin Akter',
      email: 'ngo@relifmesh.test',
      passwordHash: v1PasswordHash,
      role: 'NGO_WORKER',
      jurisdictionId: unionCharFasson._id,
      organization: 'BRAC',
    },
    {
      name: 'Jamil Hassan',
      email: 'citizen@relifmesh.test',
      passwordHash: v1PasswordHash,
      role: 'CITIZEN',
      phone: '01712345678',
      address: 'Char Fasson, Sunamganj',
    },
  ])

  // ── v2 Users (phone/OTP — 7 roles) ──────────────────────────
  const v2PasswordHash = await bcrypt.hash(TEST_OTP, 10)
  await User.create([
    {
      name: 'Super Admin',
      phone: '+8801700000001',
      passwordHash: v2PasswordHash,
      role: 'super_admin',
      isVerified: true,
    },
    {
      name: 'Admin User',
      phone: '+8801700000002',
      passwordHash: v2PasswordHash,
      role: 'admin',
      jurisdictionId: districtDhaka._id,
      isVerified: true,
    },
    {
      name: 'Brac Relief Team',
      phone: '+8801700000003',
      passwordHash: v2PasswordHash,
      role: 'ngo',
      organization: 'BRAC',
      jurisdictionId: districtSylhet._id,
      isVerified: true,
    },
    {
      name: 'UNO Dhaka',
      phone: '+8801700000004',
      passwordHash: v2PasswordHash,
      role: 'govt',
      jurisdictionId: districtDhaka._id,
      isVerified: true,
    },
    {
      name: 'Volunteer Rafiq',
      phone: '+8801700000005',
      passwordHash: v2PasswordHash,
      role: 'volunteer',
      jurisdictionId: districtSylhet._id,
      isVerified: true,
      location: {
        type: 'Point',
        coordinates: [91.8715, 24.8949], // Sylhet
      },
    },
    {
      name: 'Volunteer Karim',
      phone: '+8801700000006',
      passwordHash: v2PasswordHash,
      role: 'volunteer',
      jurisdictionId: districtSylhet._id,
      isVerified: true,
      location: {
        type: 'Point',
        coordinates: [91.8715, 24.8949],
      },
    },
    {
      name: 'Donor Salma',
      phone: '+8801700000007',
      passwordHash: v2PasswordHash,
      role: 'donor',
      isVerified: true,
    },
    {
      name: 'Victim Ayesha',
      phone: '+8801700000008',
      passwordHash: v2PasswordHash,
      role: 'victim',
      address: 'Mirpur, Dhaka',
      location: {
        type: 'Point',
        coordinates: [90.3652, 23.8223], // Mirpur
      },
    },
    {
      name: 'Victim Hossain',
      phone: '+8801700000009',
      passwordHash: v2PasswordHash,
      role: 'victim',
      address: 'Char Fasson, Sunamganj',
      location: {
        type: 'Point',
        coordinates: [91.4000, 25.0000],
      },
    },
  ])

  // ── Item Categories ──────────────────────────────────────────
  await ItemCategory.create([
    { name: 'Rice' },
    { name: 'Dal' },
    { name: 'Drinking Water' },
    { name: 'Tarp' },
    { name: 'Blanket' },
  ])

  console.log('[Seed] Done.')
  console.log('[Seed] Test accounts:')
  console.log('  ── v1 (email/password) ──')
  console.log('  upazila@relifmesh.test / password123  (UPAZILA_OFFICER)')
  console.log('  upofficial@relifmesh.test / password123 (UP_OFFICIAL)')
  console.log('  ngo@relifmesh.test / password123       (NGO_WORKER)')
  console.log('  citizen@relifmesh.test / password123   (CITIZEN)')
  console.log('  ── v2 (phone/OTP) ──')
  console.log('  +8801700000001 / 123456  (super_admin)')
  console.log('  +8801700000002 / 123456  (admin)')
  console.log('  +8801700000003 / 123456  (ngo)')
  console.log('  +8801700000004 / 123456  (govt)')
  console.log('  +8801700000005 / 123456  (volunteer)')
  console.log('  +8801700000006 / 123456  (volunteer)')
  console.log('  +8801700000007 / 123456  (donor)')
  console.log('  +8801700000008 / 123456  (victim)')
  console.log('  +8801700000009 / 123456  (victim)')
  console.log('[Seed] v2 collections (sos_requests, missions, campaigns, etc.)')
  console.log('[Seed] are auto-created when first used through the API.')

  if (needsConnection) await mongoose.disconnect()
}

if (require.main === module) {
  seed().catch(err => { console.error(err); process.exit(1) })
}

module.exports = seed