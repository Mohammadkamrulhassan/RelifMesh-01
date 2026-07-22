/**
 * Comprehensive v2 seed script
 * Seeds: GeographicArea hierarchy, ItemCategory rates, sample Households, need assessments
 * Run: node seeds/seed-v2.js
 */
const mongoose = require('mongoose')
const connectDB = require('../config/database')
const GeographicArea = require('../modules/areas/areaModel')
const { ItemCategory } = require('../modules/public/publicModel')
const Household = require('../modules/households/householdModel')
const NeedAssessment = require('../modules/need/needModel')
const ReliefPledge = require('../modules/pledges/pledgeModel')
const User = require('../modules/auth/authModel')
const bcrypt = require('bcrypt')

async function seed() {
  await connectDB()
  console.log('Connected to MongoDB\n')

  // ── 0. GeographicArea Hierarchy (needed before users) ──
  await GeographicArea.deleteMany({})
  const division = await GeographicArea.create({ name: 'Chattogram', level: 'DIVISION', coordinates: { lat: 22.3569, lng: 91.7832 } })
  const district = await GeographicArea.create({ name: 'Feni', level: 'DISTRICT', parentId: division._id, coordinates: { lat: 23.0141, lng: 91.3961 } })
  const upazila = await GeographicArea.create({ name: 'Feni Sadar', level: 'UPAZILA', parentId: district._id, coordinates: { lat: 22.9985, lng: 91.3963 } })
  const union = await GeographicArea.create({ name: 'Feni Municipality', level: 'UNION', parentId: upazila._id, coordinates: { lat: 22.9985, lng: 91.3963 } })
  const wards = await GeographicArea.insertMany([
    { name: 'Ward 1 — North Feni', level: 'WARD', parentId: union._id, coordinates: { lat: 23.005, lng: 91.390 } },
    { name: 'Ward 2 — South Feni', level: 'WARD', parentId: union._id, coordinates: { lat: 22.990, lng: 91.395 } },
    { name: 'Ward 3 — East Feni', level: 'WARD', parentId: union._id, coordinates: { lat: 23.000, lng: 91.405 } },
    { name: 'Ward 4 — West Feni', level: 'WARD', parentId: union._id, coordinates: { lat: 22.995, lng: 91.380 } },
    { name: 'Ward 5 — Central Feni', level: 'WARD', parentId: union._id, coordinates: { lat: 22.998, lng: 91.396 } },
  ])
  console.log(`✓ GeographicArea: ${wards.length} wards under ${union.name}`)

  // ── 1. Users (with jurisdictionId set to their level) ──
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password123', 10)
  const users = await User.create([
    { name: 'Kamal Hossain', email: 'upazila@reliefmesh.test', passwordHash, role: 'UPAZILA_OFFICER', jurisdictionId: upazila._id },
    { name: 'Rahim Uddin', email: 'upofficial@reliefmesh.test', passwordHash, role: 'UP_OFFICIAL', jurisdictionId: union._id },
    { name: 'Nasrin Akter', email: 'ngo@reliefmesh.test', passwordHash, role: 'NGO_WORKER', organization: 'BRAC', jurisdictionId: union._id },
    { name: 'Jamil Hassan', email: 'citizen@reliefmesh.test', passwordHash, role: 'CITIZEN', phone: '01712345678', address: 'Feni Sadar' },
  ])
  const defaultOfficer = users.find(u => u.role === 'UPAZILA_OFFICER')._id
  console.log(`✓ Users: ${users.length} accounts created`)
  console.log('  upazila@reliefmesh.test / password123  (UPAZILA_OFFICER)')
  console.log('  upofficial@reliefmesh.test / password123 (UP_OFFICIAL)')
  console.log('  ngo@reliefmesh.test / password123       (NGO_WORKER)')
  console.log('  citizen@reliefmesh.test / password123   (CITIZEN)')
  console.log('')

  // ── 2. ItemCategories with per_person_per_day_qty ──
  await ItemCategory.deleteMany({})
  const items = await ItemCategory.insertMany([
    { name: 'Rice', unit: 'kg', per_person_per_day_qty: 0.5, isActive: true },
    { name: 'Water', unit: 'liters', per_person_per_day_qty: 3, isActive: true },
    { name: 'Dry Food', unit: 'pcs', per_person_per_day_qty: 2, isActive: true },
    { name: 'Tarp / Shelter', unit: 'pcs', per_person_per_day_qty: 1, isActive: true },
    { name: 'Medicine Kit', unit: 'pcs', per_person_per_day_qty: 0.1, isActive: true },
  ])
  console.log(`✓ ItemCategories: ${items.length} items with Sphere rates`)

  // ── 3. Sample Households with age brackets ──
  await Household.deleteMany({})

  const sampleHouseholds = wards.flatMap((ward, wi) => {
    const base = wi * 30
    return Array.from({ length: 20 }, (_, i) => {
      const familySize = 3 + (i % 4)
      const c05 = Math.max(0, Math.floor(familySize * 0.15))
      const ov60 = Math.max(0, Math.floor(familySize * 0.10))
      const a1859 = familySize - c05 - ov60
      return {
        headName: `Resident ${base + i + 1}`,
        nid: `${10000000000 + base + i}`,
        gps: { lat: ward.coordinates.lat + (i % 5) * 0.002, lng: ward.coordinates.lng + Math.floor(i / 5) * 0.002 },
        familySize,
        familyMembers: Array.from({ length: familySize }, (_, fi) => ({
          name: `Member ${base + i + 1}.${fi + 1}`,
          age: fi === 0 ? 30 + fi : fi <= 1 ? 4 : 65 - fi,
          idType: 'NID',
          idNumber: `${20000000000 + base + i + fi}`,
        })),
        children_0_5: c05,
        over_60: ov60,
        adults_18_59: a1859,
        vulnerabilityFlags: { elderly: ov60 > 0, disabled: i === 0, pregnant: i === 1 },
        jurisdictionId: ward._id,
        registeredBy: defaultOfficer,
      }
    })
  })
  const households = await Household.insertMany(sampleHouseholds)
  console.log(`✓ Households: ${households.length} registered across ${wards.length} wards`)

  // ── 4. Need Assessments ──
  await NeedAssessment.deleteMany({})
  const assessments = []
  for (const ward of wards) {
    const wardHHs = households.filter(h => h.jurisdictionId.toString() === ward._id.toString())
    const totalPop = wardHHs.reduce((s, h) => s + h.familySize, 0)
    const c05 = wardHHs.reduce((s, h) => s + (h.children_0_5 || 0), 0)
    const ov60 = wardHHs.reduce((s, h) => s + (h.over_60 || 0), 0)
    const a1859 = wardHHs.reduce((s, h) => s + (h.adults_18_59 || 0), 0)

    for (const item of items) {
      const calculated_qty = totalPop * item.per_person_per_day_qty * 7
      assessments.push({
        areaId: ward._id,
        itemCategoryId: item._id,
        calculated_qty,
        coverageDays: 7,
        demographics: { totalPopulation: totalPop, children_0_5: c05, over_60: ov60, adults_18_59: a1859 },
      })
    }
  }
  await NeedAssessment.insertMany(assessments)
  console.log(`✓ NeedAssessments: ${assessments.length} records (${wards.length} wards × ${items.length} items)`)

  // ── 5. Sample Pledges ──
  await ReliefPledge.deleteMany({})
  const pledges = await ReliefPledge.insertMany([
    { source_type: 'GOVERNMENT', source_name: 'Upazila Administration', source_contact: 'up@feni.gov.bd', areaId: wards[0]._id, itemCategoryId: items[0]._id, total_qty: 5000, status: 'IN_FULFILLMENT', pledgedBy: defaultOfficer },
    { source_type: 'NGO', source_name: 'BRAC', source_contact: 'brac@contact.org', areaId: wards[1]._id, itemCategoryId: items[1]._id, total_qty: 10000, status: 'PENDING', pledgedBy: defaultOfficer },
    { source_type: 'INDIVIDUAL', source_name: 'John Doe', source_contact: '+880-1700000000', areaId: wards[2]._id, itemCategoryId: items[2]._id, total_qty: 500, status: 'PENDING', pledgedBy: defaultOfficer },
    { source_type: 'CORPORATE', source_name: 'Square Pharma', source_contact: 'info@squarepharma.com', areaId: wards[0]._id, itemCategoryId: items[4]._id, total_qty: 2000, status: 'COMPLETED', fulfilled_date: new Date(), pledgedBy: defaultOfficer },
  ])
  console.log(`✓ ReliefPledges: ${pledges.length} pledges created`)

  console.log('\n=== v2 Seed Complete! ===')
  console.log(`  ${wards.length} Wards`)
  console.log(`  ${items.length} Item Categories`)
  console.log(`  ${households.length} Households`)
  console.log(`  ${assessments.length} Need Assessments`)
  console.log(`  ${pledges.length} Pledges`)
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
