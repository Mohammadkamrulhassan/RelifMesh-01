const mongoose = require('mongoose')
const DistributionLog = require('../distributions/distributionModel')
const Household = require('../households/householdModel')
const ReliefRequest = require('../reliefRequests/reliefRequestModel')
const { ItemCategory } = require('./publicModel')

async function dashboard(req, res, next) {
  try {
    const totalHouseholds = await Household.countDocuments()
    const totalDistributions = await DistributionLog.countDocuments()
    const pendingRequests = await ReliefRequest.countDocuments({ status: 'PENDING' })
    const unions = await DistributionLog.aggregate([
      { $group: { _id: '$itemCategoryId', count: { $sum: 1 } } },
      { $lookup: { from: 'itemcategories', localField: '_id', foreignField: '_id', as: 'item' } },
    ])
    res.json({ totalHouseholds, totalDistributions, pendingRequests, unions })
  } catch (err) { next(err) }
}

async function mapData(req, res, next) {
  try {
    const data = await DistributionLog.aggregate([
      { $group: { _id: '$householdId', count: { $sum: 1 } } },
      { $limit: 200 },
    ])
    res.json({ data })
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

module.exports = { dashboard, mapData, itemCategories, adminDashboard }
