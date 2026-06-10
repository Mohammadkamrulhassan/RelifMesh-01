const { SOSRequest, Mission } = require('./sosModel')
const User = require('../auth/authModel')

async function create(req, res, next) {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const data = { ...req.body, victimId: req.user.sub, expiresAt }
    if (data.location && Array.isArray(data.location.coordinates)) {
      data.location.coordinates = data.location.coordinates.map(Number)
    }
    const sos = await SOSRequest.create(data)
    const populated = await SOSRequest.findById(sos._id).populate('victimId', 'name phone')
    res.status(201).json({ success: true, data: populated })
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const { page = 1, limit = 20, status, type, priority } = req.query
    const filter = {}
    if (status) filter.status = status
    if (type) filter.type = type
    if (priority) filter.priority = priority
    if (req.user.role === 'victim') filter.victimId = req.user.sub
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [sosList, total] = await Promise.all([
      SOSRequest.find(filter)
        .populate('victimId', 'name phone')
        .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      SOSRequest.countDocuments(filter),
    ])
    res.json({
      success: true, data: sosList,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    })
  } catch (err) { next(err) }
}

async function getActive(req, res, next) {
  try {
    const { lat, lng, radius = 10 } = req.query
    const filter = { status: { $in: ['pending', 'acknowledged', 'in_progress'] } }
    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius) * 1000,
        },
      }
    }
    const sosList = await SOSRequest.find(filter)
      .populate('victimId', 'name phone')
      .sort({ priority: -1, createdAt: -1 })
    res.json({ success: true, data: sosList })
  } catch (err) { next(err) }
}

async function getById(req, res, next) {
  try {
    const sos = await SOSRequest.findById(req.params.id)
      .populate('victimId', 'name phone')
      .populate('assignedMissionId')
    if (!sos) return res.status(404).json({ success: false, message: 'SOS request not found' })
    res.json({ success: true, data: sos })
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const sos = await SOSRequest.findById(req.params.id)
    if (!sos) return res.status(404).json({ success: false, message: 'SOS request not found' })
    if (sos.victimId.toString() !== req.user.sub && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    const allowed = ['type', 'description', 'peopleCount', 'priority']
    allowed.forEach(f => { if (req.body[f] !== undefined) sos[f] = req.body[f] })
    await sos.save()
    res.json({ success: true, data: sos })
  } catch (err) { next(err) }
}

async function cancel(req, res, next) {
  try {
    const sos = await SOSRequest.findById(req.params.id)
    if (!sos) return res.status(404).json({ success: false, message: 'SOS request not found' })
    if (sos.victimId.toString() !== req.user.sub && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    sos.status = 'cancelled'
    await sos.save()

    const io = req.app.get('io')
    if (io) {
      io.of('/sos').to(`sos:${sos._id}`).emit('sos:updated', { sosId: sos._id, status: 'cancelled' })
    }
    res.json({ success: true, data: sos })
  } catch (err) { next(err) }
}

async function getStats(req, res, next) {
  try {
    const stats = await SOSRequest.aggregate([
      { $group: { _id: { type: '$type', status: '$status' }, count: { $sum: 1 } } },
    ])
    res.json({ success: true, data: stats })
  } catch (err) { next(err) }
}

async function createMission(req, res, next) {
  try {
    const { sosId } = req.body
    const sos = await SOSRequest.findById(sosId)
    if (!sos) return res.status(404).json({ success: false, message: 'SOS not found' })
    if (sos.status !== 'pending') return res.status(400).json({ success: false, message: 'SOS already assigned or resolved' })
    const existing = await Mission.findOne({ sosId })
    if (existing) return res.status(400).json({ success: false, message: 'Mission already exists for this SOS' })
    const mission = await Mission.create({
      sosId, volunteerId: req.user.sub, status: 'assigned', startedAt: new Date(),
    })
    sos.status = 'acknowledged'
    sos.assignedMissionId = mission._id
    await sos.save()

    const io = req.app.get('io')
    if (io) {
      const populated = await Mission.findById(mission._id).populate('volunteerId', 'name phone')
      io.of('/mission').to(`mission:${mission._id}`).emit('mission:new', populated)
      io.to(`user:${sos.victimId}`).emit('notification:new', {
        type: 'sos_assigned', title: 'SOS Acknowledged', body: 'A volunteer is on the way!',
      })
    }
    res.status(201).json({ success: true, data: mission })
  } catch (err) { next(err) }
}

async function listMissions(req, res, next) {
  try {
    const { page = 1, limit = 20, status } = req.query
    const filter = {}
    if (status) filter.status = status
    if (req.user.role === 'volunteer') filter.volunteerId = req.user.sub
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [missions, total] = await Promise.all([
      Mission.find(filter)
        .populate('volunteerId', 'name phone')
        .populate({ path: 'sosId', populate: { path: 'victimId', select: 'name phone' } })
        .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Mission.countDocuments(filter),
    ])
    res.json({
      success: true, data: missions,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    })
  } catch (err) { next(err) }
}

async function getMyMissions(req, res, next) {
  try {
    const missions = await Mission.find({ volunteerId: req.user.sub })
      .populate({ path: 'sosId', populate: { path: 'victimId', select: 'name phone' } })
      .sort({ createdAt: -1 })
    res.json({ success: true, data: missions })
  } catch (err) { next(err) }
}

async function getMissionById(req, res, next) {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate('volunteerId', 'name phone')
      .populate({ path: 'sosId', populate: { path: 'victimId', select: 'name phone' } })
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' })
    res.json({ success: true, data: mission })
  } catch (err) { next(err) }
}

async function updateMissionStatus(req, res, next) {
  try {
    const { status } = req.body
    const mission = await Mission.findById(req.params.id)
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' })
    if (mission.volunteerId.toString() !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    mission.status = status
    if (status === 'on_site') mission.startedAt = mission.startedAt || new Date()
    if (status === 'completed' || status === 'rescued') mission.completedAt = new Date()
    await mission.save()
    await SOSRequest.findByIdAndUpdate(mission.sosId, { status: status === 'completed' || status === 'rescued' ? 'resolved' : 'in_progress' })

    const io = req.app.get('io')
    if (io) {
      io.of('/mission').to(`mission:${mission._id}`).emit('mission:update', mission)
      const sos = await SOSRequest.findById(mission.sosId)
      if (sos) io.to(`user:${sos.victimId}`).emit('notification:new', {
        type: 'mission_update', title: 'Mission Update', body: `Status changed to ${status}`,
      })
    }
    res.json({ success: true, data: mission })
  } catch (err) { next(err) }
}

async function updateMissionNotes(req, res, next) {
  try {
    const { notes } = req.body
    const mission = await Mission.findByIdAndUpdate(
      req.params.id, { notes }, { new: true },
    )
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' })
    res.json({ success: true, data: mission })
  } catch (err) { next(err) }
}

async function submitFeedback(req, res, next) {
  try {
    const { rating, comment } = req.body
    const mission = await Mission.findById(req.params.id)
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' })
    const sos = await SOSRequest.findById(mission.sosId)
    if (!sos || sos.victimId.toString() !== req.user.sub) {
      return res.status(403).json({ success: false, message: 'Only the victim can submit feedback' })
    }
    mission.victimFeedback = { rating, comment }
    await mission.save()
    res.json({ success: true, data: mission })
  } catch (err) { next(err) }
}

module.exports = {
  create, list, getActive, getById, update, cancel, getStats,
  createMission, listMissions, getMyMissions, getMissionById,
  updateMissionStatus, updateMissionNotes, submitFeedback,
}
