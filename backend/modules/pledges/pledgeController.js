const ReliefPledge = require('./pledgeModel')

async function create(req, res, next) {
  try {
    const data = { ...req.body, pledgedBy: req.user.sub }
    if (!data.areaId) data.areaId = undefined
    const pledge = await ReliefPledge.create(data)
    res.status(201).json({ pledge })
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const { status, areaId, source_type, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (areaId) filter.areaId = areaId
    if (source_type) filter.source_type = source_type

    // Role-based filtering
    if (req.user.role === 'CITIZEN') {
      filter.pledgedBy = req.user.sub
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [pledges, total] = await Promise.all([
      ReliefPledge.find(filter)
        .populate('itemCategoryId', 'name')
        .populate('areaId', 'name level')
        .populate('pledgedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ReliefPledge.countDocuments(filter),
    ])
    res.json({ pledges, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) { next(err) }
}

async function getById(req, res, next) {
  try {
    const pledge = await ReliefPledge.findById(req.params.id)
      .populate('itemCategoryId', 'name')
      .populate('areaId', 'name level')
      .populate('pledgedBy', 'name email')
    if (!pledge) return res.status(404).json({ error: 'Pledge not found' })
    res.json({ pledge })
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const { status } = req.body
    const updateData = { ...req.body }

    // Auto-set fulfilled_date when status changes to COMPLETED
    if (status === 'COMPLETED') {
      updateData.fulfilled_date = new Date()
    }

    const pledge = await ReliefPledge.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
    if (!pledge) return res.status(404).json({ error: 'Pledge not found' })
    res.json({ pledge })
  } catch (err) { next(err) }
}

async function remove(req, res, next) {
  try {
    const pledge = await ReliefPledge.findByIdAndDelete(req.params.id)
    if (!pledge) return res.status(404).json({ error: 'Pledge not found' })
    res.json({ message: 'Pledge deleted' })
  } catch (err) { next(err) }
}

/**
 * Update pledge status with lifecycle validation
 */
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'Status is required' })

    const validTransitions = {
      PENDING: ['IN_FULFILLMENT', 'CANCELLED'],
      IN_FULFILLMENT: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    }

    const pledge = await ReliefPledge.findById(req.params.id)
    if (!pledge) return res.status(404).json({ error: 'Pledge not found' })

    if (!validTransitions[pledge.status].includes(status)) {
      return res.status(400).json({
        error: `Invalid transition from ${pledge.status} to ${status}`,
      })
    }

    pledge.status = status
    if (status === 'COMPLETED') {
      pledge.fulfilled_date = new Date()
      pledge.distributed_qty = pledge.total_qty
    }
    await pledge.save()

    res.json({ pledge })
  } catch (err) { next(err) }
}

async function myPledges(req, res, next) {
  try {
    const pledges = await ReliefPledge.find({ pledgedBy: req.user.sub })
      .populate('itemCategoryId', 'name')
      .populate('areaId', 'name level')
      .populate('pledgedBy', 'name email')
      .sort({ createdAt: -1 })
    res.json({ pledges })
  } catch (err) { next(err) }
}

module.exports = { create, list, getById, update, remove, updateStatus, myPledges }
