const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const { seedTestData, getToken, closeDB } = require('../../tests/helpers')

const app = express()
app.use(express.json())
app.use('/v1/households', require('../households/householdRoutes'))
app.use('/v1/distributions', require('../distributions/distributionRoutes'))
app.use('/v1/sync', require('./syncRoutes'))
app.use(require('../../middleware/errorHandler'))

let token, householdId, categoryId, distributionId, userId

beforeAll(async () => {
  await seedTestData()
  token = await getToken('UP_OFFICIAL')
  const user = await mongoose.connection.db.collection('users').findOne({ role: 'UP_OFFICIAL' })
  userId = user._id.toString()

  const hhRes = await request(app)
    .post('/v1/households')
    .set('Authorization', `Bearer ${token}`)
    .send({ headName: 'Sync Test', nid: '7777777777777', familySize: 3, gps: { lat: 22.5, lng: 91.8 } })
  householdId = hhRes.body.household?._id

  const cat = await mongoose.connection.db.collection('itemcategories').findOne({ name: 'Rice' })
  categoryId = cat._id.toString()

  const distRes = await request(app)
    .post('/v1/distributions')
    .set('Authorization', `Bearer ${token}`)
    .send({ householdId, itemCategoryId: categoryId, quantity: 5, unit: 'kg', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString() })
  distributionId = distRes.body.log?._id
})
afterAll(async () => await closeDB())

describe('Sync Module', () => {
  test('Push accepts records array', async () => {
    const res = await request(app)
      .post('/v1/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({ records: [{ officerId: userId, householdId, itemCategoryId: categoryId, quantity: 3, unit: 'kg', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString() }] })
    expect(res.status).toBe(201)
    expect(res.body.synced).toBeGreaterThanOrEqual(1)
  })

  test('Pull returns records since timestamp', async () => {
    const since = new Date(Date.now() - 86400000).toISOString()
    const res = await request(app)
      .get(`/v1/sync/pull?since=${since}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.records).toBeDefined()
    expect(Array.isArray(res.body.records)).toBe(true)
  })

  test('Push rejects non-array records', async () => {
    const res = await request(app)
      .post('/v1/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({ records: 'not-an-array' })
    expect(res.status).toBe(400)
  })
})
