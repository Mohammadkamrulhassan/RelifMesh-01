const request = require('supertest')
const express = require('express')
const { seedTestData, closeDB } = require('../../tests/helpers')

const app = express()
app.use('/v1/public', require('./publicRoutes'))
app.use(require('../../middleware/errorHandler'))

beforeAll(async () => await seedTestData())
afterAll(async () => await closeDB())

describe('Public Module — TC-20', () => {
  test('TC-20: Public dashboard — no auth returns 200', async () => {
    const res = await request(app).get('/v1/public/dashboard')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('totalHouseholds')
    expect(res.body).toHaveProperty('totalDistributions')
  })

  test('Public map data returns without auth', async () => {
    const res = await request(app).get('/v1/public/map')
    expect(res.status).toBe(200)
  })
})
