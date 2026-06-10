const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  messageType: {
    type: String, enum: ['text', 'image', 'location'], default: 'text',
  },
  isRead: { type: Boolean, default: false },
}, { timestamps: true })

chatMessageSchema.index({ missionId: 1, createdAt: 1 })

chatMessageSchema.set('toJSON', {
  transform(doc, ret) {
    ret.messageId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String, enum: [
      'sos_assigned', 'mission_update', 'relief_approved',
      'donation_receipt', 'system_alert',
    ], required: true,
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
}, { timestamps: true })

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })

notificationSchema.set('toJSON', {
  transform(doc, ret) {
    ret.notificationId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

module.exports = {
  ChatMessage: mongoose.model('ChatMessage', chatMessageSchema),
  Notification: mongoose.model('Notification', notificationSchema),
}
