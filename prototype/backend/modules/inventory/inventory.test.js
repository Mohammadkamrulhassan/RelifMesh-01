const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const { seedTestData, getToken, closeDB } = require('../../tests/helpers')

const app = express()
app.use(express.json())
app.use('/v1/inventory', require('./inventoryRoutes'))
app.use(require('../../middleware/errorHandler'))

let upazilaToken, upToken, riceId

beforeAll(async () => {
  await seedTestData()
  upazilaToken = await getToken('UPAZILA_OFFICER')
  upToken = await getToken('UP_OFFICIAL')
  const cat = await mongoose.connection.db.collection('itemcategories').findOne({ name: 'Rice' })
  riceId = cat._id.toString()
})

afterAll(async () => await closeDB())

describe('Inventory Module', () => {
  test('TC-INV01: Create inventory item', async () => {
    const res = await request(app)
      .post('/v1/inventory')
      .set('Authorization', `Bearer ${upazilaToken}`)
      .send({ itemCategoryId: riceId, totalQuantity: 1000, unit: 'kg' })
    expect(res.status).toBe(201)
    expect(res.body.item).toBeDefined()
  })

  test('TC-INV02: List inventory', async () => {
    const res = await request(app)
      .get('/v1/inventory')
      .set('Authorization', `Bearer ${upToken}`)
    expect(res.status).toBe(200)
    expect(res.body.items).toBeDefined()
  })

  test('TC-INV03: UP Official cannot create inventory', async () => {
    const res = await request(app)
      .post('/v1/inventory')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ itemCategoryId: riceId, totalQuantity: 500, unit: 'kg' })
    expect(res.status).toBe(403)
  })
})
