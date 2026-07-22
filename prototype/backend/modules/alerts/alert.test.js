const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const { seedTestData, getToken, closeDB } = require('../../tests/helpers')

const app = express()
app.use(express.json())
app.use('/v1/households', require('../households/householdRoutes'))
app.use('/v1/distributions', require('../distributions/distributionRoutes'))
app.use('/v1/alerts', require('./alertRoutes'))
app.use(require('../../middleware/errorHandler'))

let upToken, householdId, riceId, dalId

beforeAll(async () => {
  await seedTestData()
  upToken = await getToken('UP_OFFICIAL')

  const hhRes = await request(app)
    .post('/v1/households')
    .set('Authorization', `Bearer ${upToken}`)
    .send({ headName: 'Alert Test', nid: '1000000000002', familySize: 3, gps: { lat: 22.5, lng: 91.8 } })
  householdId = hhRes.body.household?._id

  const cats = await mongoose.connection.db.collection('itemcategories').find().toArray()
  riceId = cats.find(c => c.name === 'Rice')._id.toString()
  dalId = cats.find(c => c.name === 'Dal')._id.toString()
})
afterAll(async () => await closeDB())

describe('Alert/Duplicate Detection — TC-12 to TC-16', () => {
  test('TC-12: Same item within 7 days -> duplicate', async () => {
    const log1 = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ householdId, itemCategoryId: riceId, quantity: 5, unit: 'kg', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString() })
    expect(log1.status).toBe(201)

    const log2 = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ householdId, itemCategoryId: riceId, quantity: 3, unit: 'kg', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString(), overrideReason: '' })
    expect(log2.status).toBe(409)
    expect(log2.body.isDuplicate).toBe(true)
  })

  test('TC-14: Different item -> no duplicate', async () => {
    const res = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ householdId, itemCategoryId: dalId, quantity: 2, unit: 'kg', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString() })
    expect(res.status).toBe(201)
  })

  test('TC-15: Override accepted with reason', async () => {
    const res = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ householdId, itemCategoryId: riceId, quantity: 5, unit: 'kg', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString(), overrideReason: 'Emergency need' })
    expect(res.status).toBe(201)
    expect(res.body.log.isOverride).toBe(true)
  })

  test('TC-16: Override rejected without reason', async () => {
    const res = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ householdId, itemCategoryId: riceId, quantity: 3, unit: 'kg', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString(), overrideReason: '' })
    expect(res.status).toBe(409)
  })
})
