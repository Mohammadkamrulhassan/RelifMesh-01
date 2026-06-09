const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const { seedTestData, getToken, closeDB } = require('../../tests/helpers')

const app = express()
app.use(express.json())
app.use('/v1/households', require('../households/householdRoutes'))
app.use('/v1/distributions', require('./distributionRoutes'))
app.use(require('../../middleware/errorHandler'))

let upToken, ngoToken, householdId, categoryId, dalId

beforeAll(async () => {
  await seedTestData()
  upToken = await getToken('UP_OFFICIAL')
  ngoToken = await getToken('NGO_WORKER')

  const hhRes = await request(app)
    .post('/v1/households')
    .set('Authorization', `Bearer ${upToken}`)
    .send({ headName: 'Dist Test', nid: '1111111111111', familySize: 3, gps: { lat: 22.5, lng: 91.8 } })
  householdId = hhRes.body.household?._id || hhRes.body.household?.hhId

  const catRes = await mongoose.connection.db.collection('itemcategories').findOne({ name: 'Rice' })
  categoryId = catRes._id.toString()
  const dalRes = await mongoose.connection.db.collection('itemcategories').findOne({ name: 'Dal' })
  dalId = dalRes._id.toString()
})
afterAll(async () => await closeDB())

describe('Distribution Module — TC-09 to TC-11', () => {
  test('TC-09: Valid distribution log saved', async () => {
    const res = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({
        householdId,
        itemCategoryId: categoryId,
        quantity: 10,
        unit: 'kg',
        gps: { lat: 22.5, lng: 91.8 },
        distributedAt: new Date().toISOString(),
      })
    expect(res.status).toBe(201)
    expect(res.body.log).toBeDefined()
    expect(res.body.log.quantity).toBe(10)
  })

  test('TC-10: Unknown HH-ID rejected', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString()
    const res = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({
        householdId: fakeId,
        itemCategoryId: categoryId,
        quantity: 5,
        unit: 'kg',
        gps: { lat: 22.5, lng: 91.8 },
        distributedAt: new Date().toISOString(),
      })
    expect(res.status).toBe(404)
  })

  test('TC-11: Quantity must be positive', async () => {
    const res = await request(app)
      .post('/v1/distributions')
      .set('Authorization', `Bearer ${upToken}`)
      .send({
        householdId,
        itemCategoryId: dalId,
        quantity: -5,
        unit: 'kg',
        gps: { lat: 22.5, lng: 91.8 },
        distributedAt: new Date().toISOString(),
      })
    expect(res.status).toBe(400)
  })
})
