const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const { seedTestData, getToken, closeDB } = require('../../tests/helpers')

const app = express()
app.use(express.json())
app.use('/v1/feedback', require('./feedbackRoutes'))
app.use('/v1/auth', require('../auth/authRoutes'))
app.use(require('../../middleware/errorHandler'))

let upToken, upazilaToken

beforeAll(async () => {
  await seedTestData()
  upToken = await getToken('UP_OFFICIAL')
  upazilaToken = await getToken('UPAZILA_OFFICER')
})

afterAll(async () => await closeDB())

describe('Feedback Module', () => {
  test('TC-FB01: Submit feedback without auth', async () => {
    const res = await request(app)
      .post('/v1/feedback')
      .send({ name: 'Test User', message: 'Great system, very helpful' })
    expect(res.status).toBe(201)
    expect(res.body.feedback).toBeDefined()
  })

  test('TC-FB02: List feedback requires auth', async () => {
    const res = await request(app).get('/v1/feedback')
    expect(res.status).toBe(401)
  })

  test('TC-FB03: Admin can list feedback', async () => {
    const res = await request(app)
      .get('/v1/feedback')
      .set('Authorization', `Bearer ${upazilaToken}`)
    expect(res.status).toBe(200)
    expect(res.body.feedbacks).toBeDefined()
  })

  test('TC-FB04: Respond to feedback', async () => {
    const fb = await request(app)
      .post('/v1/feedback')
      .send({ name: 'Respond Test', message: 'Need help with relief' })
    const fbId = fb.body.feedback._id
    const res = await request(app)
      .put(`/v1/feedback/${fbId}/respond`)
      .set('Authorization', `Bearer ${upazilaToken}`)
      .send({ response: 'We will look into it' })
    expect(res.status).toBe(200)
    expect(res.body.feedback.isRead).toBe(true)
  })
})
