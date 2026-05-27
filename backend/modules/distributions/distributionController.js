const DistributionLog = require('./distributionModel')
const DuplicateAlert = require('../alerts/alertModel')

async function create(req, res, next) {
  try {
    const { householdId, itemCategoryId, quantity, unit, gps, photoUrl, distributedAt, overrideReason } = req.body

    const existing = await DistributionLog.findOne({
      householdId,
      itemCategoryId,
      distributedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).sort({ distributedAt: -1 })

    if (existing && !overrideReason) {
      return res.status(409).json({
        error: 'Duplicate distribution detected',
        priorLog: existing,
      })
    }

    const log = await DistributionLog.create({
      householdId,
      officerId: req.user.sub,
      itemCategoryId,
      quantity,
      unit,
      gps,
      photoUrl,
      distributedAt,
      isOverride: !!overrideReason,
      overrideReason,
      syncStatus: 'SYNCED',
    })

    if (existing && overrideReason) {
      await DuplicateAlert.create({
        householdId,
        priorLogId: existing._id,
        triggeredLogId: log._id,
        itemCategoryId,
        isResolved: true,
        resolvedBy: req.user.sub,
        overrideReason,
      })
    }

    res.status(201).json({ log })
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const filter = {}
    if (req.query.householdId) filter.householdId = req.query.householdId
    const logs = await DistributionLog.find(filter)
      .populate('householdId')
      .sort({ distributedAt: -1 })
    res.json({ logs })
  } catch (err) { next(err) }
}

async function duplicateCheck(req, res, next) {
  try {
    const { householdId, itemCategoryId } = req.query
    const existing = await DistributionLog.findOne({
      householdId,
      itemCategoryId,
      distributedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).sort({ distributedAt: -1 })
    res.json({ isDuplicate: !!existing, priorLog: existing })
  } catch (err) { next(err) }
}

module.exports = { create, list, duplicateCheck }
