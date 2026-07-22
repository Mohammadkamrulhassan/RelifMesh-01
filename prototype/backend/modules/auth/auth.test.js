const request = require('supertest')
const express = require('express')
const { seedTestData, getToken, closeDB } = require('../../tests/helpers')

const app = express()
app.use(express.json())
app.use('/v1/auth', require('./authRoutes'))
app.use(require('../../middleware/errorHandler'))

beforeAll(async () => await seedTestData())
afterAll(async () => await closeDB())

describe('Auth Module — TC-01 to TC-04', () => {
  test('TC-01: Valid login returns JWT', async () => {
    const res = await request(app)
      .post('/v1/auth/login')
      .send({ email: 'upofficial@test.com', password: 'password' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.role).toBe('UP_OFFICIAL')
  })

  test('TC-02: Invalid password rejected', async () => {
    const res = await request(app)
      .post('/v1/auth/login')
      .send({ email: 'upofficial@test.com', password: 'wrongpassword' })
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid credentials')
  })

  test('TC-03: Non-existent user rejected', async () => {
    const res = await request(app)
      .post('/v1/auth/login')
      .send({ email: 'nonexistent@test.com', password: 'password' })
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid credentials')
  })

  test('TC-04: Role embedded correctly in JWT', async () => {
    const res = await request(app)
      .post('/v1/auth/login')
      .send({ email: 'ngo@test.com', password: 'password' })
    expect(res.status).toBe(200)
    const decoded = JSON.parse(Buffer.from(res.body.token.split('.')[1], 'base64url').toString())
    expect(decoded.role).toBe('NGO_WORKER')
    expect(decoded.sub).toBeDefined()
    expect(decoded.jurisdictionId).toBeDefined()
  })
})
