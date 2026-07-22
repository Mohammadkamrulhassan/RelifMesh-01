const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const { seedTestData, getToken, closeDB } = require('../../tests/helpers')

const app = express()
app.use(express.json())
app.use('/v1/households', require('./householdRoutes'))
app.use(require('../../middleware/errorHandler'))

let token, upazilaToken
let householdId

beforeAll(async () => {
  await seedTestData()
  token = await getToken('UP_OFFICIAL')
  upazilaToken = await getToken('UPAZILA_OFFICER')
})
afterAll(async () => await closeDB())

describe('Household Module — TC-05 to TC-08', () => {
  test('TC-05: Valid registration saves household', async () => {
    const res = await request(app)
      .post('/v1/households')
      .set('Authorization', `Bearer ${token}`)
      .send({
        headName: 'Test Person',
        nid: '1234567890123',
        familySize: 4,
        gps: { lat: 22.5, lng: 91.8 },
        vulnerabilityFlags: { elderly: false, disabled: false, pregnant: false },
      })
    expect(res.status).toBe(201)
    expect(res.body.household).toBeDefined()
    expect(res.body.household.headName).toBe('Test Person')
    householdId = res.body.household._id
  })

  test('TC-06: Duplicate NID is rejected', async () => {
    const res = await request(app)
      .post('/v1/households')
      .set('Authorization', `Bearer ${token}`)
      .send({
        headName: 'Another Person',
        nid: '1234567890123',
        familySize: 2,
        gps: { lat: 22.5, lng: 91.8 },
      })
    expect(res.status).toBe(500)
    expect(res.body.message || '').toMatch(/duplicate|E11000/i)
  })

  test('TC-07: Missing required field fails validation', async () => {
    const res = await request(app)
      .post('/v1/households')
      .set('Authorization', `Bearer ${token}`)
      .send({ headName: '', nid: '', familySize: '' })
    expect(res.status).toBe(400)
  })

  test('TC-08: GPS coordinates stored correctly', async () => {
    const res = await request(app)
      .get(`/v1/households/${householdId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.household.gps.lat).toBe(22.5)
    expect(res.body.household.gps.lng).toBe(91.8)
  })

  test('TC-09: Registration with family members', async () => {
    const res = await request(app)
      .post('/v1/households')
      .set('Authorization', `Bearer ${token}`)
      .send({
        headName: 'Family Test',
        nid: '9999999999999',
        gps: { lat: 23.5, lng: 90.5 },
        familyMembers: [
          { name: 'Adult Son', age: 25, idType: 'NID', idNumber: 'NID123456' },
          { name: 'Child Daughter', age: 10, idType: 'BIRTH', idNumber: 'BIRTH789' },
        ],
      })
    expect(res.status).toBe(201)
    expect(res.body.household.familySize).toBe(2)
    expect(res.body.household.familyMembers).toHaveLength(2)
  })

  test('TC-10: Upazila Officer can register household', async () => {
    const res = await request(app)
      .post('/v1/households')
      .set('Authorization', `Bearer ${upazilaToken}`)
      .send({
        headName: 'Upazila Reg',
        nid: '1000000000001',
        familySize: 3,
        gps: { lat: 23.6, lng: 90.6 },
      })
    expect(res.status).toBe(201)
  })
})
