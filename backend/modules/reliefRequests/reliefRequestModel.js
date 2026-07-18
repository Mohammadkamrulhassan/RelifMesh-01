const mongoose = require('mongoose')

const requestedItemSchema = new mongoose.Schema({
  itemCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory', required: true },
  quantity: { type: Number, required: true, min: 0.01 },
  unit: { type: String, required: true },
}, { _id: false })

const reliefRequestSchema = new mongoose.Schema({
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household' },
  description: { type: String, trim: true },
  items: { type: [requestedItemSchema], default: [] },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'FULFILLED'],
    default: 'PENDING',
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM',
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
  },
  jurisdictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'GeographicArea' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  reviewNotes: { type: String, default: null },
}, { timestamps: true })

reliefRequestSchema.index({ citizenId: 1, createdAt: -1 })
reliefRequestSchema.index({ status: 1, jurisdictionId: 1 })

reliefRequestSchema.set('toJSON', {
  transform(doc, ret) {
    ret.requestId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('ReliefRequest', reliefRequestSchema)
