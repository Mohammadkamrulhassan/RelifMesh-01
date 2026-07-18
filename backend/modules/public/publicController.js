const mongoose = require('mongoose')
const DistributionLog = require('../distributions/distributionModel')
const Household = require('../households/householdModel')
const ReliefRequest = require('../reliefRequests/reliefRequestModel')
const GeographicArea = require('../areas/areaModel')
const { ItemCategory } = require('./publicModel')

async function dashboard(req, res, next) {
  try {
    const totalHouseholds = await Household.countDocuments()
    const totalDistributions = await DistributionLog.countDocuments()
    const pendingRequests = await ReliefRequest.countDocuments({ status: 'PENDING' })
    const totalAreas = await GeographicArea.countDocuments()
    const totalItemCategories = await ItemCategory.countDocuments({ isActive: { $ne: false } })
    const recentDistributions = await DistributionLog.find()
      .populate('householdId', 'headName nid')
      .populate('itemCategoryId', 'name')
      .sort({ distributedAt: -1 })
      .limit(5)
    res.json({ totalHouseholds, totalDistributions, pendingRequests, totalAreas, totalItemCategories, recentDistributions })
  } catch (err) { next(err) }
}

async function mapData(req, res, next) {
  try {
    // Group distributions by household, then join with household's GeographicArea to get real coordinates
    const data = await DistributionLog.aggregate([
      { $group: { _id: '$householdId', count: { $sum: 1 }, items: { $addToSet: '$itemCategoryId' } } },
      { $lookup: { from: 'households', localField: '_id', foreignField: '_id', as: 'household' } },
      { $unwind: { path: '$household', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'geographicareas', localField: 'household.jurisdictionId', foreignField: '_id', as: 'area' } },
      { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          householdId: '$_id',
          count: 1,
          itemsCount: { $size: '$items' },
          areaName: '$area.name',
          areaLevel: '$area.level',
          lat: '$area.coordinates.lat',
          lng: '$area.coordinates.lng',
          headName: '$household.headName',
        },
      },
      { $limit: 200 },
    ])
    res.json({ data })
  } catch (err) { next(err) }
}

async function recentActivities(req, res, next) {
  try {
    const recentDists = await DistributionLog.find()
      .populate('householdId', 'headName nid')
      .populate('itemCategoryId', 'name')
      .sort({ distributedAt: -1 })
      .limit(5)
      .lean()

    const recentRequests = await ReliefRequest.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    res.json({ distributions: recentDists, reliefRequests: recentRequests })
  } catch (err) { next(err) }
}

async function itemCategories(req, res, next) {
  try {
    const cats = await ItemCategory.find({ isActive: { $ne: false } }).lean()
    res.json({ categories: cats })
  } catch (err) { next(err) }
}

async function adminDashboard(req, res, next) {
  try {
    const totalHouseholds = await Household.countDocuments({ jurisdictionId: req.user.jurisdictionId })
    const totalDistributions = await DistributionLog.countDocuments()
    const pendingSync = await DistributionLog.countDocuments({ syncStatus: 'PENDING' })
    const unresolvedAlerts = await mongoose.model('DuplicateAlert').countDocuments({ isResolved: false })
    const totalFeedbacks = await mongoose.model('Feedback').countDocuments({ isRead: false })
    const pendingRequests = await ReliefRequest.countDocuments({ status: 'PENDING' })
    const recentDistributions = await DistributionLog.find()
      .populate('householdId', 'headName nid')
      .populate('itemCategoryId', 'name')
      .sort({ distributedAt: -1 })
      .limit(5)
    res.json({ totalHouseholds, totalDistributions, pendingSync, unresolvedAlerts, totalFeedbacks, pendingRequests, recentDistributions })
  } catch (err) { next(err) }
}

/**
 * Distribution heatmap — total relief delivered per geographic area
 * Groups distributions by household → area, sums quantity per area, returns coordinates
 * Returns: { points: [{ lat, lng, intensity, areaName, areaId, totalQty }] }
 */
async function distributionHeatmap(req, res, next) {
  try {
    const points = await DistributionLog.aggregate([
      // 1. Group by household to aggregate per-household totals
      { $group: { _id: '$householdId', totalQty: { $sum: '$quantity' }, count: { $sum: 1 } } },
      // 2. Lookup household to get jurisdictionId
      { $lookup: { from: 'households', localField: '_id', foreignField: '_id', as: 'household' } },
      { $unwind: { path: '$household', preserveNullAndEmptyArrays: true } },
      // 3. Lookup geographic area to get coordinates
      { $lookup: { from: 'geographicareas', localField: 'household.jurisdictionId', foreignField: '_id', as: 'area' } },
      { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
      // 4. Re-group by areaId to get per-area totals with coordinates
      {
        $group: {
          _id: '$household.jurisdictionId',
          totalQty: { $sum: '$totalQty' },
          distributionCount: { $sum: '$count' },
          lat: { $first: '$area.coordinates.lat' },
          lng: { $first: '$area.coordinates.lng' },
          areaName: { $first: '$area.name' },
        },
      },
      // 5. Keep only points with valid coordinates
      { $match: { lat: { $ne: null }, lng: { $ne: null } } },
      // 6. Shape output
      {
        $project: {
          _id: 0,
          areaId: '$_id',
          areaName: 1,
          lat: 1,
          lng: 1,
          intensity: '$totalQty',
          totalQty: 1,
          distributionCount: 1,
        },
      },
    ])
    res.json({ points })
  } catch (err) { next(err) }
}

module.exports = { dashboard, mapData, itemCategories, adminDashboard, recentActivities, distributionHeatmap }
