/**
 * Seed script for v2 data: ItemCategory units/rates, GeographicArea hierarchy
 * Run: node modules/public/publicSeed.js
 */
const mongoose = require('mongoose')
const connectDB = require('../../config/database')
const { ItemCategory } = require('./publicModel')
const GeographicArea = require('../areas/areaModel')

async function seed() {
  await connectDB()

  // Update item categories with per_person_per_day_qty
  const itemUpdates = [
    { name: 'Rice', unit: 'kg', per_person_per_day_qty: 0.5 },
    { name: 'Water', unit: 'liters', per_person_per_day_qty: 3 },
    { name: 'Tarp / Shelter', unit: 'pcs', per_person_per_day_qty: 0.01 },
    { name: 'Dry Food', unit: 'pcs', per_person_per_day_qty: 2 },
    { name: 'Medicine', unit: 'pcs', per_person_per_day_qty: 0.1 },
  ]

  for (const item of itemUpdates) {
    const existing = await ItemCategory.findOne({ name: item.name })
    if (existing) {
      await ItemCategory.findByIdAndUpdate(existing._id, { ...item, isActive: true })
      console.log(`Updated ItemCategory: ${item.name}`)
    } else {
      await ItemCategory.create(item)
      console.log(`Created ItemCategory: ${item.name}`)
    }
  }

  // Create GeographicArea hierarchy if not exists
  const divCount = await GeographicArea.countDocuments({ level: 'DIVISION' })
  if (divCount === 0) {
    const division = await GeographicArea.create({
      name: 'Chattogram',
      level: 'DIVISION',
      coordinates: { lat: 22.3569, lng: 91.7832 },
    })
    const district = await GeographicArea.create({
      name: 'Feni',
      level: 'DISTRICT',
      parentId: division._id,
      coordinates: { lat: 23.0141, lng: 91.3961 },
    })
    const upazila = await GeographicArea.create({
      name: 'Feni Sadar',
      level: 'UPAZILA',
      parentId: district._id,
      coordinates: { lat: 22.9985, lng: 91.3963 },
    })
    const union = await GeographicArea.create({
      name: 'Feni Municipality',
      level: 'UNION',
      parentId: upazila._id,
      coordinates: { lat: 22.9985, lng: 91.3963 },
    })
    const wards = [
      { name: 'Ward 1 — North Feni', lat: 23.005, lng: 91.390 },
      { name: 'Ward 2 — South Feni', lat: 22.990, lng: 91.395 },
      { name: 'Ward 3 — East Feni', lat: 23.000, lng: 91.405 },
      { name: 'Ward 4 — West Feni', lat: 22.995, lng: 91.380 },
      { name: 'Ward 5 — Central Feni', lat: 22.998, lng: 91.396 },
    ]
    for (const w of wards) {
      await GeographicArea.create({ name: w.name, level: 'WARD', parentId: union._id, coordinates: { lat: w.lat, lng: w.lng } })
    }
    console.log(`Created GeographicArea hierarchy: 1 Div, 1 Dist, 1 Upazila, 1 Union, ${wards.length} Wards`)
  } else {
    console.log('GeographicArea hierarchy already exists, skipping')
  }

  console.log('\nSeed complete!')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
