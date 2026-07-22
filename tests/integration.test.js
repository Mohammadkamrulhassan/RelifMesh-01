const request = require('supertest')
const express = require('express')
const mongoose = require('mongoose')
const Household = require('../modules/households/householdModel')
const User = require('../modules/auth/authModel')
const { seedTestData, getToken, closeDB } = require('./helpers')

const app = express()
app.use(express.json())
app.use('/v1/auth', require('../modules/auth/authRoutes'))
app.use('/v1/households', require('../modules/households/householdRoutes'))
app.use('/v1/areas', require('../modules/areas/areaRoutes'))
app.use('/v1/needs', require('../modules/need/needRoutes'))
app.use('/v1/pledges', require('../modules/pledges/pledgeRoutes'))
app.use('/v1/distributions', require('../modules/distributions/distributionRoutes'))
app.use('/v1/alerts', require('../modules/alerts/alertRoutes'))
app.use('/v1/reports', require('../modules/reports/reportRoutes'))
app.use('/v1/public', require('../modules/public/publicRoutes'))
app.use('/v1/sync', require('../modules/sync/syncRoutes'))
app.use(require('../middleware/errorHandler'))

let seedData, upToken, ngoToken, upazilaToken, householdId, riceId

beforeAll(async () => {
  seedData = await seedTestData()
  upToken = await getToken('UP_OFFICIAL')
  ngoToken = await getToken('NGO_WORKER')
  upazilaToken = await getToken('UPAZILA_OFFICER')
  riceId = seedData.riceCat._id.toString()

  // Create a test household — use Mongoose directly so jurisdictionId is set to ward level
  // (the HTTP controller overrides jurisdictionId with req.user's own jurisdiction which is union level)
  const upOfficial = await User.findOne({ role: 'UP_OFFICIAL' })
  const hh = await Household.create({
    headName: 'Test Head',
    nid: '6666666666666',
    familySize: 4,
    children_0_5: 1,
    over_60: 1,
    adults_18_59: 2,
    jurisdictionId: seedData.ward._id,
    gps: { lat: 23.5, lng: 91.2 },
    registeredBy: upOfficial._id,
  })
  householdId = hh._id
})

afterAll(async () => await closeDB())

/* ======================== GeographicAreas ======================== */

describe('GeographicArea Endpoints', () => {
  test('GA-1: Public — list top-level areas (parentId=null)', async () => {
    const res = await request(app).get('/v1/areas/')
    expect(res.status).toBe(200)
    expect(res.body.areas).toBeDefined()
    expect(res.body.areas.length).toBeGreaterThanOrEqual(1)
    expect(res.body.areas.every(a => a.parentId === null)).toBe(true)
  })

  test('GA-2: Public — get hierarchy', async () => {
    const res = await request(app).get('/v1/areas/hierarchy')
    expect(res.status).toBe(200)
    expect(res.body.hierarchy).toBeDefined()
  })

  test('GA-3: Public — get area by ID', async () => {
    const res = await request(app).get(`/v1/areas/${seedData.ward._id}`)
    expect(res.status).toBe(200)
    expect(res.body.area.name).toBe('Test Ward 1')
    expect(res.body.area.level).toBe('WARD')
  })

  test('GA-4: Public — get children of an area', async () => {
    const res = await request(app).get(`/v1/areas/${seedData.union._id}/children`)
    expect(res.status).toBe(200)
    expect(res.body.areas.length).toBeGreaterThanOrEqual(1)
    expect(res.body.areas.some(a => a.level === 'WARD')).toBe(true)
  })

  test('GA-5: Public — get tree of an area', async () => {
    const res = await request(app).get(`/v1/areas/${seedData.union._id}/tree`)
    expect(res.status).toBe(200)
    expect(res.body.area).toBeDefined()
    expect(res.body.children).toBeDefined()
  })

  test('GA-6: Public — get nonexistent area returns 404', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app).get(`/v1/areas/${fakeId}`)
    expect(res.status).toBe(404)
  })

  test('GA-7: Unauthenticated cannot create area', async () => {
    const res = await request(app)
      .post('/v1/areas')
      .send({ name: 'Rogue Area', level: 'WARD' })
    expect(res.status).toBe(401)
  })

  test('GA-8: UPAZILA_OFFICER can create area', async () => {
    const res = await request(app)
      .post('/v1/areas')
      .set('Authorization', `Bearer ${upazilaToken}`)
      .send({ name: 'New Ward', level: 'WARD', parentId: seedData.union._id.toString() })
    expect(res.status).toBe(201)
    expect(res.body.area.name).toBe('New Ward')
  })

  test('GA-9: UP_OFFICIAL cannot create area (forbidden)', async () => {
    const res = await request(app)
      .post('/v1/areas')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ name: 'Rogue Area', level: 'WARD' })
    expect(res.status).toBe(403)
  })

  test('GA-10: Cannot delete area with children', async () => {
    // district has children so it should fail
    const res = await request(app)
      .delete(`/v1/areas/${seedData.district._id}`)
      .set('Authorization', `Bearer ${upazilaToken}`)
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/child/i)
  })

  test('GA-11: Delete non-child area', async () => {
    const area = await request(app)
      .post('/v1/areas')
      .set('Authorization', `Bearer ${upazilaToken}`)
      .send({ name: 'Delete Me', level: 'WARD', parentId: seedData.union._id.toString() })
    const res = await request(app)
      .delete(`/v1/areas/${area.body.area._id}`)
      .set('Authorization', `Bearer ${upazilaToken}`)
    expect(res.status).toBe(200)
  })

  test('GA-12: Update area name', async () => {
    const res = await request(app)
      .put(`/v1/areas/${seedData.ward._id}`)
      .set('Authorization', `Bearer ${upazilaToken}`)
      .send({ name: 'Updated Ward' })
    expect(res.status).toBe(200)
    expect(res.body.area.name).toBe('Updated Ward')
  })
})

/* ======================== Need Assessments ======================== */

describe('Need Assessment Endpoints', () => {
  test('NEED-1: Public — heatmap endpoint returns points', async () => {
    const res = await request(app).get('/v1/needs/heatmap')
    expect(res.status).toBe(200)
    expect(res.body.points).toBeDefined()
  })

  test('NEED-2: UPAZILA_OFFICER can calculate need for a ward', async () => {
    const res = await request(app)
      .post('/v1/needs/calculate')
      .set('Authorization', `Bearer ${upazilaToken}`)
      .send({ areaId: seedData.ward._id.toString(), coverageDays: 7 })
    expect(res.status).toBe(200)
    expect(res.body.assessments).toBeDefined()
    // Our test household has familySize=4, so totalPopulation=4
    // Rice rate=0.4, coverageDays=7 => 4*0.4*7 = 11.2
    expect(res.body.demographics.totalPopulation).toBe(4)
    expect(res.body.assessments.length).toBeGreaterThanOrEqual(1)
  })

  test('NEED-3: List assessments for the ward', async () => {
    const res = await request(app)
      .get(`/v1/needs?areaId=${seedData.ward._id}`)
      .set('Authorization', `Bearer ${upToken}`)
    expect(res.status).toBe(200)
    expect(res.body.assessments.length).toBeGreaterThanOrEqual(1)
    expect(res.body.assessments[0].itemCategoryId).toBeDefined()
  })

  test('NEED-4: Get summary endpoint returns aggregated data', async () => {
    const res = await request(app)
      .get('/v1/needs/summary')
      .set('Authorization', `Bearer ${upToken}`)
    expect(res.status).toBe(200)
    expect(res.body.byArea).toBeDefined()
  })

  test('NEED-5: Can override assessment', async () => {
    // Get the assessment first
    const listRes = await request(app)
      .get(`/v1/needs?areaId=${seedData.ward._id}`)
      .set('Authorization', `Bearer ${upToken}`)
    const assessmentId = listRes.body.assessments[0]._id

    const res = await request(app)
      .put(`/v1/needs/${assessmentId}/override`)
      .set('Authorization', `Bearer ${upazilaToken}`)
      .send({ override_qty: 100, override_reason: 'Urgent need detected' })
    expect(res.status).toBe(200)
    expect(res.body.assessment.override_qty).toBe(100)
    expect(res.body.assessment.effective_qty).toBe(100)
  })

  test('NEED-6: Override requires reason', async () => {
    const listRes = await request(app)
      .get(`/v1/needs?areaId=${seedData.ward._id}`)
      .set('Authorization', `Bearer ${upToken}`)
    const assessmentId = listRes.body.assessments[0]._id

    const res = await request(app)
      .put(`/v1/needs/${assessmentId}/override`)
      .set('Authorization', `Bearer ${upazilaToken}`)
      .send({ override_qty: 100, override_reason: '' })
    expect(res.status).toBe(400)
  })

  test('NEED-7: Get single assessment by ID', async () => {
    const listRes = await request(app)
      .get(`/v1/needs?areaId=${seedData.ward._id}`)
      .set('Authorization', `Bearer ${upToken}`)
    const assessmentId = listRes.body.assessments[0]._id

    const res = await request(app)
      .get(`/v1/needs/${assessmentId}`)
      .set('Authorization', `Bearer ${upToken}`)
    expect(res.status).toBe(200)
    expect(res.body.assessment._id).toBe(assessmentId)
  })

  test('NEED-8: 401 when not authenticated for list', async () => {
    const res = await request(app).get('/v1/needs')
    expect(res.status).toBe(401)
  })
})

/* ======================== Pledges ======================== */

describe('Pledge Endpoints', () => {
  let pledgeId

  test('PLEDGE-1: Create a pledge', async () => {
    const res = await request(app)
      .post('/v1/pledges')
      .set('Authorization', `Bearer ${ngoToken}`)
      .send({
        source_type: 'NGO',
        source_name: 'Test NGO',
        source_contact: 'ngo@test.com',
        areaId: seedData.ward._id.toString(),
        itemCategoryId: riceId,
        total_qty: 500,
        notes: 'Test pledge',
      })
    expect(res.status).toBe(201)
    expect(res.body.pledge.source_type).toBe('NGO')
    expect(res.body.pledge.status).toBe('PENDING')
    expect(res.body.pledge.remaining_qty).toBe(500)
    pledgeId = res.body.pledge._id
  })

  test('PLEDGE-2: List pledges', async () => {
    const res = await request(app)
      .get('/v1/pledges')
      .set('Authorization', `Bearer ${upToken}`)
    expect(res.status).toBe(200)
    expect(res.body.pledges.length).toBeGreaterThanOrEqual(1)
    expect(res.body.total).toBeGreaterThanOrEqual(1)
  })

  test('PLEDGE-3: Get pledge by ID', async () => {
    const res = await request(app)
      .get(`/v1/pledges/${pledgeId}`)
      .set('Authorization', `Bearer ${upToken}`)
    expect(res.status).toBe(200)
    expect(res.body.pledge._id).toBe(pledgeId)
    expect(res.body.pledge.itemCategoryId).toBeDefined()
    expect(res.body.pledge.areaId).toBeDefined()
  })

  test('PLEDGE-4: My pledges returns only user pledges', async () => {
    const res = await request(app)
      .get('/v1/pledges/my')
      .set('Authorization', `Bearer ${ngoToken}`)
    expect(res.status).toBe(200)
    expect(res.body.pledges.length).toBeGreaterThanOrEqual(1)
    // All returned pledges should have a populated pledgedBy field
    expect(res.body.pledges.every(p => p.pledgedBy && p.pledgedBy._id)).toBe(true)
  })

  test('PLEDGE-5: Update pledge status — valid transition PENDING→IN_FULFILLMENT', async () => {
    const res = await request(app)
      .put(`/v1/pledges/${pledgeId}/status`)
      .set('Authorization', `Bearer ${upToken}`)
      .send({ status: 'IN_FULFILLMENT' })
    expect(res.status).toBe(200)
    expect(res.body.pledge.status).toBe('IN_FULFILLMENT')
  })

  test('PLEDGE-6: Update pledge status — valid transition IN_FULFILLMENT→COMPLETED', async () => {
    const res = await request(app)
      .put(`/v1/pledges/${pledgeId}/status`)
      .set('Authorization', `Bearer ${upToken}`)
      .send({ status: 'COMPLETED' })
    expect(res.status).toBe(200)
    expect(res.body.pledge.status).toBe('COMPLETED')
    expect(res.body.pledge.fulfilled_date).toBeDefined()
    expect(res.body.pledge.distributed_qty).toBe(res.body.pledge.total_qty)
  })

  test('PLEDGE-7: Update pledge status — invalid transition COMPLETED→PENDING returns 400', async () => {
    const res = await request(app)
      .put(`/v1/pledges/${pledgeId}/status`)
      .set('Authorization', `Bearer ${upToken}`)
      .send({ status: 'PENDING' })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/invalid transition/i)
  })

  test('PLEDGE-8: Cannot update pledge without status field', async () => {
    const res = await request(app)
      .put(`/v1/pledges/${pledgeId}/status`)
      .set('Authorization', `Bearer ${upToken}`)
      .send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/status is required/i)
  })

  test('PLEDGE-9: Delete pledge requires UPAZILA_OFFICER', async () => {
    const res = await request(app)
      .delete(`/v1/pledges/${pledgeId}`)
      .set('Authorization', `Bearer ${ngoToken}`)
    expect(res.status).toBe(403)
  })

  test('PLEDGE-10: UPAZILA_OFFICER can delete pledge', async () => {
    const res = await request(app)
      .delete(`/v1/pledges/${pledgeId}`)
      .set('Authorization', `Bearer ${upazilaToken}`)
    expect(res.status).toBe(200)
  })

  test('PLEDGE-11: Get nonexistent pledge returns 404', async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const res = await request(app)
      .get(`/v1/pledges/${fakeId}`)
      .set('Authorization', `Bearer ${upToken}`)
    expect(res.status).toBe(404)
  })
})

/* ======================== Existing Legacy Tests ======================== */

describe('Legacy Integration Tests — TC-17 to TC-22', () => {
  test('TC-17: Register -> Log -> Duplicate', async () => {
    const hh = await request(app)
      .post('/v1/households')
      .set('Authorization', `Bearer ${upToken}`)
      .send({ headName: 'Flow Test', nid: '7777777777777', familySize: 2, gps: { lat: 22.5, lng: 91.8 } })
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
