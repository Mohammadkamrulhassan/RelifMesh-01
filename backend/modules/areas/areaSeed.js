/**
 * Seed script for GeographicArea — Feni District, Bangladesh
 * Division → District → Upazila → Union → Ward
 * Run: node modules/areas/areaSeed.js
 */
const mongoose = require('mongoose')
const GeographicArea = require('./areaModel')
const connectDB = require('../../config/database')

async function seed() {
  await connectDB()

  // Clear existing areas
  await GeographicArea.deleteMany({})
  console.log('Cleared existing GeographicArea collection')

  // 1. Division
  const division = await GeographicArea.create({
    name: 'Chattogram',
    level: 'DIVISION',
    coordinates: { lat: 22.3569, lng: 91.7832 },
  })
  console.log(`Created DIVISION: ${division.name} (${division._id})`)

  // 2. District
  const district = await GeographicArea.create({
    name: 'Feni',
    level: 'DISTRICT',
    parentId: division._id,
    coordinates: { lat: 23.0141, lng: 91.3961 },
  })
  console.log(`Created DISTRICT: ${district.name} (${district._id})`)

  // 3. Upazila
  const upazila = await GeographicArea.create({
    name: 'Feni Sadar',
    level: 'UPAZILA',
    parentId: district._id,
    coordinates: { lat: 22.9985, lng: 91.3963 },
  })
  console.log(`Created UPAZILA: ${upazila.name} (${upazila._id})`)

  // 4. Union
  const union = await GeographicArea.create({
    name: 'Feni Municipality',
    level: 'UNION',
    parentId: upazila._id,
    coordinates: { lat: 22.9985, lng: 91.3963 },
  })
  console.log(`Created UNION: ${union.name} (${union._id})`)

  // 5. Wards
  const wardData = [
    { name: 'Ward 1 — North Feni', lat: 23.005, lng: 91.390 },
    { name: 'Ward 2 — South Feni', lat: 22.990, lng: 91.395 },
    { name: 'Ward 3 — East Feni', lat: 23.000, lng: 91.405 },
    { name: 'Ward 4 — West Feni', lat: 22.995, lng: 91.380 },
    { name: 'Ward 5 — Central Feni', lat: 22.998, lng: 91.396 },
  ]

  const wards = []
  for (const w of wardData) {
    const ward = await GeographicArea.create({
      name: w.name,
      level: 'WARD',
      parentId: union._id,
      coordinates: { lat: w.lat, lng: w.lng },
    })
    wards.push(ward)
    console.log(`  Created WARD: ${ward.name} (${ward._id})`)
  }

  console.log(`\nSeed complete: 1 Division, 1 District, 1 Upazila, 1 Union, ${wards.length} Wards`)
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
