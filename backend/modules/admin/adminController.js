const { SOSRequest, Mission } = require('../sos/sosModel')
const { Campaign, Donation } = require('../campaign/campaignModel')
const { Notification } = require('../chat/chatModel')
const { Shelter } = require('../shelter/shelterModel')
const User = require('../auth/authModel')

async function getDashboard(req, res, next) {
  try {
    const [
      activeSos, totalMissions, openMissions,
      totalCampaigns, totalDonations, totalDonationAmount,
      totalShelters, occupancySum, capacitySum,
      totalUsers, verifiedUsers, totalNgo,
    ] = await Promise.all([
      SOSRequest.countDocuments({ status: { $in: ['pending', 'acknowledged', 'in_progress'] } }),
      Mission.countDocuments(),
      Mission.countDocuments({ status: { $in: ['assigned', 'en_route', 'on_site'] } }),
      Campaign.countDocuments(),
      Donation.countDocuments({ status: 'completed' }),
      Donation.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Shelter.countDocuments({ isActive: true }),
      Shelter.aggregate([{ $group: { _id: null, total: { $sum: '$currentOccupancy' } } }]),
      Shelter.aggregate([{ $group: { _id: null, total: { $sum: '$capacity' } } }]),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ role: 'ngo' }),
    ])

    res.json({
      success: true, data: {
        activeSos, totalMissions, openMissions,
        totalCampaigns, totalDonations, totalDonationAmount: totalDonationAmount[0]?.total || 0,
        totalShelters, totalOccupancy: occupancySum[0]?.total || 0, totalCapacity: capacitySum[0]?.total || 0,
        totalUsers, verifiedUsers, totalNgo,
      },
    })
  } catch (err) { next(err) }
}

async function getHeatmapData(req, res, next) {
  try {
    const sosLocations = await SOSRequest.find(
      { status: { $in: ['pending', 'acknowledged', 'in_progress'] }, 'location.coordinates': { $exists: true } },
      { location: 1, type: 1, priority: 1, status: 1, createdAt: 1 },
    ).lean()
    res.json({ success: true, data: sosLocations })
  } catch (err) { next(err) }
}

async function getSosAnalytics(req, res, next) {
  try {
    const { startDate, endDate } = req.query
    const match = {}
    if (startDate || endDate) {
      match.createdAt = {}
      if (startDate) match.createdAt.$gte = new Date(startDate)
      if (endDate) match.createdAt.$lte = new Date(endDate)
    }
    const byType = await SOSRequest.aggregate([
      { $match: match },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ])
    const byStatus = await SOSRequest.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    const byDay = await SOSRequest.aggregate([
      { $match: match },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    res.json({ success: true, data: { byType, byStatus, byDay } })
  } catch (err) { next(err) }
}

async function getDonationAnalytics(req, res, next) {
  try {
    const { startDate, endDate } = req.query
    const match = { status: 'completed' }
    if (startDate || endDate) {
      match.createdAt = {}
      if (startDate) match.createdAt.$gte = new Date(startDate)
      if (endDate) match.createdAt.$lte = new Date(endDate)
    }
    const byMethod = await Donation.aggregate([
      { $match: match },
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ])
    const byDay = await Donation.aggregate([
      { $match: match },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    res.json({ success: true, data: { byMethod, byDay } })
  } catch (err) { next(err) }
}

async function getInventoryReports(req, res, next) {
  try {
    const Inventory = require('../inventory/inventoryModel')
    const items = await Inventory.find().populate('itemCategoryId')
    res.json({ success: true, data: items })
  } catch (err) { next(err) }
}

async function getAuditLogs(req, res, next) {
  try {
    const AuditLog = require('./adminModel')
    const { page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [logs, total] = await Promise.all([
      AuditLog.find().populate('userId', 'name phone role').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      AuditLog.countDocuments(),
    ])
    res.json({
      success: true, data: logs,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    })
  } catch (err) { next(err) }
}

async function getAlerts(req, res, next) {
  try {
    const Inventory = require('../inventory/inventoryModel')
    const lowStock = await Inventory.find({ $expr: { $lte: ['$totalQuantity', 10] } }).populate('itemCategoryId')
    const expiringSoon = await Inventory.find({
      $expr: { $and: [{ $ne: ['$lastRestockedAt', null] }, { $lte: [{ $subtract: [new Date(), '$lastRestockedAt'] }, 3 * 24 * 60 * 60 * 1000] }] },
    }).populate('itemCategoryId')
    res.json({ success: true, data: { lowStock, expiringSoon } })
  } catch (err) { next(err) }
}

async function logAudit(req, res, next) {
  try {
    const AuditLog = require('./adminModel')
    await AuditLog.create({
      userId: req.user.sub,
      action: req.body.action,
      resource: req.body.resource,
      resourceId: req.body.resourceId,
      details: req.body.details,
      ipAddress: req.ip,
    })
    next()
  } catch (err) { next(err) }
}

module.exports = {
  getDashboard, getHeatmapData, getSosAnalytics, getDonationAnalytics,
  getInventoryReports, getAuditLogs, getAlerts, logAudit,
}
