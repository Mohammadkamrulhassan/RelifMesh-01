const mongoose = require('mongoose')
const NeedAssessment = require('./needModel')
const Household = require('../households/householdModel')
const ItemCategory = require('../public/publicModel').ItemCategory
const GeographicArea = require('../areas/areaModel')

/**
 * Calculate needs for all item categories in a given area (ward level).
 * Formula: population × per_person_per_day_qty × coverageDays
 */
async function calculate(req, res, next) {
  try {
    const { areaId, coverageDays = 7 } = req.body
    if (!areaId) return res.status(400).json({ error: 'areaId is required' })

    const area = await GeographicArea.findById(areaId)
    if (!area) return res.status(404).json({ error: 'Area not found' })

    // If area is not a WARD, find its leaf wards
    let wardIds = [areaId]
    if (area.level !== 'WARD') {
      const wards = await GeographicArea.find({ level: 'WARD', parentId: { $in: await getDescendantIds(area) } })
      wardIds = wards.map(w => w._id)
    }

    // Aggregate demographics per ward
    // Convert ward IDs to ObjectId for proper $match in aggregation
    const wardObjectIds = wardIds.map(id => new mongoose.Types.ObjectId(id))

    // Find households within the target wards (jurisdictionId refs GeographicArea)
    const demographics = await Household.aggregate([
      { $match: { jurisdictionId: { $in: wardObjectIds } } },
      {
        $group: {
          _id: null,
          totalPopulation: { $sum: { $ifNull: ['$familySize', 0] } },
          children_0_5: { $sum: { $ifNull: ['$children_0_5', 0] } },
          over_60: { $sum: { $ifNull: ['$over_60', 0] } },
          adults_18_59: { $sum: { $ifNull: ['$adults_18_59', 0] } },
          householdCount: { $sum: 1 },
        },
      },
    ])

    const demo = demographics[0] || {
      totalPopulation: 0, children_0_5: 0, over_60: 0, adults_18_59: 0, householdCount: 0,
    }

    // Get all active item categories with their per-person rates
    const categories = await ItemCategory.find({ isActive: true })

    const results = []
    for (const cat of categories) {
      const rate = cat.per_person_per_day_qty || 1
      const calculated_qty = demo.totalPopulation * rate * parseInt(coverageDays)

      // Upsert (create or update)
      const assessment = await NeedAssessment.findOneAndUpdate(
        { areaId, itemCategoryId: cat._id },
        {
          areaId,
          itemCategoryId: cat._id,
          calculated_qty,
          coverageDays: parseInt(coverageDays),
          demographics: {
            totalPopulation: demo.totalPopulation,
            children_0_5: demo.children_0_5,
            over_60: demo.over_60,
            adults_18_59: demo.adults_18_59,
          },
          calculated_at: new Date(),
          calculated_by: req.user?.sub || null,
          $unset: { override_qty: '', override_reason: '', overriddenBy: '' },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      results.push(assessment)
    }

    res.json({
      message: 'Need assessment calculated',
      demographics: demo,
      assessments: results,
    })
  } catch (err) { next(err) }
}

/**
 * Override a specific need assessment
 */
async function setOverride(req, res, next) {
  try {
    const { id } = req.params
    const { override_qty, override_reason } = req.body
    if (override_qty == null || !override_reason) {
      return res.status(400).json({ error: 'override_qty and override_reason are required' })
    }
    const assessment = await NeedAssessment.findByIdAndUpdate(
      id,
      { override_qty, override_reason, overriddenBy: req.user.sub },
      { new: true }
    )
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' })
    res.json({ assessment })
  } catch (err) { next(err) }
}

/**
 * List need assessments for a given area
 */
async function list(req, res, next) {
  try {
    const { areaId } = req.query
    const filter = {}
    if (areaId) filter.areaId = areaId
    const assessments = await NeedAssessment.find(filter)
      .populate('itemCategoryId', 'name')
      .populate('areaId', 'name level')
      .sort({ createdAt: -1 })
    res.json({ assessments })
  } catch (err) { next(err) }
}

/**
 * Get single assessment by ID
 */
async function getById(req, res, next) {
  try {
    const assessment = await NeedAssessment.findById(req.params.id)
      .populate('itemCategoryId', 'name')
      .populate('areaId', 'name level')
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' })
    res.json({ assessment })
  } catch (err) { next(err) }
}

/**
 * Get need summary across all areas (for dashboard / heatmap)
 */
async function summary(req, res, next) {
  try {
    const assessments = await NeedAssessment.find()
      .populate('itemCategoryId', 'name')
      .populate('areaId', 'name level coordinates population')

    // Aggregate by area
    const byArea = {}
    for (const a of assessments) {
      const areaId = a.areaId?._id?.toString() || a.areaId?.toString()
      if (!byArea[areaId]) {
        byArea[areaId] = {
          area: a.areaId,
          items: [],
          totalCalculated: 0,
          totalEffective: 0,
        }
      }
      byArea[areaId].items.push(a)
      byArea[areaId].totalCalculated += a.calculated_qty
      byArea[areaId].totalEffective += a.effective_qty
    }

    res.json({ byArea: Object.values(byArea) })
  } catch (err) { next(err) }
}

/**
 * Heatmap data: [{ areaId, lat, lng, intensity }]
 */
async function heatmap(req, res, next) {
  try {
    const { itemCategoryId } = req.query
    const match = {}
    if (itemCategoryId) match.itemCategoryId = itemCategoryId

    const assessments = await NeedAssessment.find(match).populate('areaId', 'name level coordinates')

    const points = assessments
      .filter(a => a.areaId?.coordinates?.lat && a.areaId?.coordinates?.lng)
      .map(a => ({
        areaId: a.areaId._id,
        areaName: a.areaId.name,
        lat: a.areaId.coordinates.lat,
        lng: a.areaId.coordinates.lng,
        intensity: a.effective_qty,
        calculated_qty: a.calculated_qty,
        override_qty: a.override_qty,
      }))

    res.json({ points })
  } catch (err) { next(err) }
}

// Helper: get all descendant IDs for an area
async function getDescendantIds(area) {
  const ids = [area._id]
  const children = await GeographicArea.find({ parentId: area._id })
  for (const child of children) {
    const childIds = await getDescendantIds(child)
    ids.push(...childIds)
  }
  return ids
}

module.exports = { calculate, setOverride, list, getById, summary, heatmap }
