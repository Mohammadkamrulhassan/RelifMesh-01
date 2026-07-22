const request = require('supertest')
const express = require('express')
const { seedTestData, getToken, closeDB } = require('../../tests/helpers')

// Register models for populate
require('../households/householdModel')
require('../auth/authModel')
require('../public/publicModel')

const app = express()
app.use(express.json())
app.use('/v1/reports', require('./reportRoutes'))
app.use(require('../../middleware/errorHandler'))

let upToken, upOfficialToken

beforeAll(async () => {
  await seedTestData()
  upToken = await getToken('UPAZILA_OFFICER')
  upOfficialToken = await getToken('UP_OFFICIAL')
})
afterAll(async () => await closeDB())

describe('Reports Module', () => {
  test('Upazila Officer can export CSV report', async () => {
    const res = await request(app)
      .get('/v1/reports/export?format=csv')
      .set('Authorization', `Bearer ${upToken}`)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/csv|json/)
  })

  test('UP Official cannot access reports (403)', async () => {
    const res = await request(app)
      .get('/v1/reports/export?format=csv')
      .set('Authorization', `Bearer ${upOfficialToken}`)
    expect(res.status).toBe(403)
  })

  test('Reports endpoint rejects unauthenticated requests', async () => {
    const res = await request(app)
      .get('/v1/reports/export?format=csv')
    expect(res.status).toBe(401)
  })
})
