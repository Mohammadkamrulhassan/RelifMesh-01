const { ChatMessage, Notification } = require('./chatModel')
const Mission = require('../sos/sosModel').Mission

async function getMessages(req, res, next) {
  try {
    const { missionId } = req.params
    const mission = await Mission.findById(missionId)
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' })
    const isAssigned = mission.volunteerId.toString() === req.user.sub
    if (!isAssigned && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    const messages = await ChatMessage.find({ missionId })
      .populate('senderId', 'name phone role')
      .sort({ createdAt: 1 })
    res.json({ success: true, data: messages })
  } catch (err) { next(err) }
}

async function sendMessage(req, res, next) {
  try {
    const { missionId } = req.params
    const { message, messageType } = req.body
    const mission = await Mission.findById(missionId)
    if (!mission) return res.status(404).json({ success: false, message: 'Mission not found' })
    const isAssigned = mission.volunteerId.toString() === req.user.sub
    if (!isAssigned && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    const chat = await ChatMessage.create({
      missionId, senderId: req.user.sub, message, messageType: messageType || 'text',
    })
    const populated = await ChatMessage.findById(chat._id).populate('senderId', 'name phone role')

    const io = req.app.get('io')
    if (io) {
      io.of('/mission').to(`mission:${missionId}`).emit('chat:receive', {
        missionId, message: populated.message, sender: populated.senderId, messageType: populated.messageType,
        createdAt: populated.createdAt,
      })
    }
    res.status(201).json({ success: true, data: populated })
  } catch (err) { next(err) }
}

async function getNotifications(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query
    const filter = { userId: req.user.sub }
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Notification.countDocuments(filter),
    ])
    res.json({
      success: true, data: notifications,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    })
  } catch (err) { next(err) }
}

async function markRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.sub },
      { isRead: true, readAt: new Date() },
      { new: true },
    )
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' })
    res.json({ success: true, data: notification })
  } catch (err) { next(err) }
}

async function markAllRead(req, res, next) {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.sub, isRead: false },
      { isRead: true, readAt: new Date() },
    )
    res.json({ success: true, message: `${result.modifiedCount} notifications marked as read` })
  } catch (err) { next(err) }
}

module.exports = { getMessages, sendMessage, getNotifications, markRead, markAllRead }
