const connectDB = require('../config/database')
const User = require('../modules/auth/authModel')
const GeographicArea = require('../modules/areas/areaModel')

async function fix() {
  await connectDB()

  const usersWithoutJurisdiction = await User.find({
    role: { $in: ['UPAZILA_OFFICER', 'UP_OFFICIAL', 'NGO_WORKER'] },
    $or: [{ jurisdictionId: { $exists: false } }, { jurisdictionId: null }],
  })

  if (usersWithoutJurisdiction.length === 0) {
    console.log('All users already have jurisdictionId. Nothing to fix.')
    process.exit(0)
  }

  const upazilaArea = await GeographicArea.findOne({ level: 'UPAZILA' })
  const unionArea = await GeographicArea.findOne({ level: 'UNION' })

  if (!upazilaArea || !unionArea) {
    console.error('No GeographicArea records found. Run seed-v2.js first.')
    process.exit(1)
  }

  let fixed = 0
  for (const user of usersWithoutJurisdiction) {
    if (user.role === 'UPAZILA_OFFICER') {
      user.jurisdictionId = upazilaArea._id
    } else {
      user.jurisdictionId = unionArea._id
    }
    await user.save()
    fixed++
    console.log(`  [FIX] ${user.role} "${user.name}" → ${user.role === 'UPAZILA_OFFICER' ? upazilaArea.name : unionArea.name}`)
  }

  console.log(`\n✓ Fixed ${fixed} user(s). Log out and log back in for changes to take effect.`)
  process.exit(0)
}

fix().catch(err => { console.error(err); process.exit(1) })
