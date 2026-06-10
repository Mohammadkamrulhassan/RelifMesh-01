const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const { seedTestData, getToken, closeDB } = require('./helpers')

const app = express()
app.use(express.json())
app.use('/v1/auth', require('../modules/auth/authRoutes'))
app.use('/v1/households', require('../modules/households/householdRoutes'))
app.use('/v1/distributions', require('../modules/distributions/distributionRoutes'))
app.use('/v1/alerts', require('../modules/alerts/alertRoutes'))
app.use('/v1/reports', require('../modules/reports/reportRoutes'))
app.use('/v1/public', require('../modules/public/publicRoutes'))
app.use('/v1/sync', require('../modules/sync/syncRoutes'))
app.use(require('../middleware/errorHandler'))

let upToken, ngoToken, upazilaToken, householdId, riceId

beforeAll(async () => {
  await seedTestData()
  upToken = await getToken('UP_OFFICIAL')
  ngoToken = await getToken('NGO_WORKER')
  upazilaToken = await getToken('UPAZILA_OFFICER')

  const cat = await mongoose.connection.db.collection('itemcategories').findOne({ name: 'Rice' })
  riceId = cat._id.toString()
})
afterAll(async () => await closeDB())

describe('Integration Tests — TC-17 to TC-22', () => {
  test('TC-17: Register -> Log -> Duplicate', async () => {
    const hh = await request(app)
      .post('/v1/households')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ headName: 'Flow Test', nid: '6666666666666', familySize: 2, gps: { lat: 22.5, lng: 91.8 } })
    expect(hh.status).toBe(201)
    householdId = hh.body.household?._id

    const log1 = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ householdId, itemCategoryId: riceId, quantity: 5, unit: 'kg', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString() })
    expect(log1.status).toBe(201)

    const dup = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ householdId, itemCategoryId: riceId, quantity: 3, unit: 'kg', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString(), overrideReason: '' })
    expect(dup.status).toBe(409)
    expect(dup.body.isDuplicate).toBe(true)
  })

  test('TC-19: Role access control — UP Official cannot export reports', async () => {
    const res = await request(app)
      .get('/v1/reports/export?format=csv')
      .set('Authorization', `Bearer ${upToken}`)
    expect(res.status).toBe(403)
  })

  test('TC-20: Public dashboard — no auth returns 200', async () => {
    const res = await request(app).get('/v1/public/dashboard')
    expect(res.status).toBe(200)
  })

  test('TC-07: Unauthorized access — no JWT returns 401', async () => {
    const res = await request(app).get('/v1/households')
    expect(res.status).toBe(401)
  })

  test('NGO Worker can log distribution', async () => {
    const hh = await request(app)
      .post('/v1/households')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ headName: 'NGO Test HH', nid: '5555555555555', familySize: 3, gps: { lat: 22.5, lng: 91.8 } })
    const hhId = hh.body.household?._id

    const res = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({ householdId: hhId, itemCategoryId: riceId, quantity: 2, unit: 'L', gps: { lat: 22.5, lng: 91.8 }, distributedAt: new Date().toISOString() })
    expect(res.status).toBe(201)
  })
})
