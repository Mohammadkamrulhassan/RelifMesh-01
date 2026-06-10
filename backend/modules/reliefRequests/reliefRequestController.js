const ReliefRequest = require('./reliefRequestModel')
const User = require('../auth/authModel')

async function create(req, res, next) {
  try {
    const data = {
      ...req.body,
      citizenId: req.user.sub,
      jurisdictionId: req.user.jurisdictionId || null,
    }
    const request = await ReliefRequest.create(data)
    const populated = await ReliefRequest.findById(request._id)
      .populate('items.itemCategoryId')
    res.status(201).json({ request: populated })
  } catch (err) { next(err) }
}

async function listMyRequests(req, res, next) {
  try {
    const { page = 1, limit = 20, status } = req.query
    const filter = { citizenId: req.user.sub }
    if (status) filter.status = status
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [requests, total] = await Promise.all([
      ReliefRequest.find(filter)
        .populate('items.itemCategoryId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ReliefRequest.countDocuments(filter),
    ])
    res.json({ requests, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) { next(err) }
}

async function getById(req, res, next) {
  try {
    const request = await ReliefRequest.findById(req.params.id)
      .populate('items.itemCategoryId')
      .populate('reviewedBy', 'name email')
    if (!request) return res.status(404).json({ error: 'Request not found' })
    if (request.citizenId.toString() !== req.user.sub && req.user.role === 'CITIZEN') {
      return res.status(403).json({ error: 'Forbidden' })
    }
    res.json({ request })
  } catch (err) { next(err) }
}

async function cancel(req, res, next) {
  try {
    const request = await ReliefRequest.findOne({ _id: req.params.id, citizenId: req.user.sub })
    if (!request) return res.status(404).json({ error: 'Request not found' })
    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Can only cancel pending requests' })
    }
    request.status = 'REJECTED'
    await request.save()
    res.json({ request })
  } catch (err) { next(err) }
}

async function listAll(req, res, next) {
  try {
    const { page = 1, limit = 20, status, priority } = req.query
    const filter = {}
    if (req.user.jurisdictionId) filter.jurisdictionId = req.user.jurisdictionId
    if (status) filter.status = status
    if (priority) filter.priority = priority
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [requests, total] = await Promise.all([
      ReliefRequest.find(filter)
        .populate('citizenId', 'name email phone')
        .populate('items.itemCategoryId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ReliefRequest.countDocuments(filter),
    ])
    res.json({ requests, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) { next(err) }
}

async function review(req, res, next) {
  try {
    const { status, reviewNotes } = req.body
    const request = await ReliefRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ error: 'Request not found' })
    request.status = status
    request.reviewNotes = reviewNotes || null
    request.reviewedBy = req.user.sub
    request.reviewedAt = new Date()
    await request.save()
    const populated = await ReliefRequest.findById(request._id)
      .populate('citizenId', 'name email phone')
      .populate('items.itemCategoryId')
      .populate('reviewedBy', 'name email')
    res.json({ request: populated })
  } catch (err) { next(err) }
}

module.exports = { create, listMyRequests, getById, cancel, listAll, review }
