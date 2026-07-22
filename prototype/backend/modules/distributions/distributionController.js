const DistributionLog = require('./distributionModel')
const DuplicateAlert = require('../alerts/alertModel')
const Household = require('../households/householdModel')

async function create(req, res, next) {
  try {
    const { householdId, itemCategoryId, quantity, unit, gps, photoUrl, distributedAt, overrideReason } = req.body

    const household = await Household.findById(householdId)
    if (!household) return res.status(404).json({ error: 'Household not found' })

    const existing = await DistributionLog.findOne({
      householdId,
      itemCategoryId,
      distributedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).sort({ distributedAt: -1 })

    if (existing && !overrideReason) {
      return res.status(409).json({
        error: 'Duplicate distribution detected',
        isDuplicate: true,
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
    const { page = 1, limit = 20, householdId, itemCategoryId, startDate, endDate, syncStatus, q } = req.query
    const filter = {}
    if (householdId) filter.householdId = householdId
    if (itemCategoryId) filter.itemCategoryId = itemCategoryId
    if (startDate || endDate) {
      filter.distributedAt = {}
      if (startDate) filter.distributedAt.$gte = new Date(startDate)
      if (endDate) filter.distributedAt.$lte = new Date(endDate)
    }
    if (syncStatus) filter.syncStatus = syncStatus
    if (q) {
      filter.$or = [
        { unit: { $regex: q, $options: 'i' } },
      ]
    }
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [logs, total] = await Promise.all([
      DistributionLog.find(filter)
        .populate('householdId itemCategoryId officerId')
        .sort({ distributedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      DistributionLog.countDocuments(filter),
    ])
    res.json({ logs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
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

async function getById(req, res, next) {
  try {
    const log = await DistributionLog.findById(req.params.id)
      .populate('householdId', 'headName nid')
      .populate('itemCategoryId', 'name')
      .populate('officerId', 'name email')
    if (!log) return res.status(404).json({ error: 'Distribution not found' })
    res.json({ log })
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const { quantity, unit, gps, photoUrl, distributedAt, overrideReason, itemCategoryId } = req.body
    const log = await DistributionLog.findById(req.params.id)
    if (!log) return res.status(404).json({ error: 'Distribution not found' })
    if (quantity !== undefined) log.quantity = quantity
    if (unit !== undefined) log.unit = unit
    if (itemCategoryId !== undefined) log.itemCategoryId = itemCategoryId
    if (gps) log.gps = gps
    if (photoUrl !== undefined) log.photoUrl = photoUrl
    if (distributedAt !== undefined) log.distributedAt = distributedAt
    if (overrideReason !== undefined) {
      log.overrideReason = overrideReason
      log.isOverride = !!overrideReason
    }
    await log.save()
    const populated = await DistributionLog.findById(log._id)
      .populate('householdId', 'headName nid')
      .populate('itemCategoryId', 'name')
      .populate('officerId', 'name email')
    res.json({ log: populated })
  } catch (err) { next(err) }
}

async function remove(req, res, next) {
  try {
    const log = await DistributionLog.findByIdAndDelete(req.params.id)
    if (!log) return res.status(404).json({ error: 'Distribution not found' })
    res.json({ message: 'Distribution deleted' })
  } catch (err) { next(err) }
}

module.exports = { create, list, getById, update, remove, duplicateCheck }
