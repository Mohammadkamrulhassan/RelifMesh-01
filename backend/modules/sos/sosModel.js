const mongoose = require('mongoose')

const sosRequestSchema = new mongoose.Schema({
  victimId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String, enum: ['rescue', 'food', 'water', 'medical', 'shelter', 'other'], required: true,
  },
  description: { type: String, default: '' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  address: { type: String, default: '' },
  peopleCount: { type: Number, min: 1 },
  priority: {
    type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high',
  },
  status: {
    type: String, enum: ['pending', 'acknowledged', 'in_progress', 'resolved', 'cancelled', 'expired'],
    default: 'pending',
  },
  assignedMissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
  mediaUrls: [{ type: String }],
  expiresAt: { type: Date, required: true },
  isOffline: { type: Boolean, default: false },
}, { timestamps: true })

sosRequestSchema.index({ victimId: 1, status: 1 })
sosRequestSchema.index({ location: '2dsphere' })
sosRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

sosRequestSchema.set('toJSON', {
  transform(doc, ret) {
    ret.sosId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

const missionSchema = new mongoose.Schema({
  sosId: { type: mongoose.Schema.Types.ObjectId, ref: 'SOSRequest', required: true, unique: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String, enum: ['assigned', 'en_route', 'on_site', 'rescued', 'completed', 'cancelled'],
    default: 'assigned',
  },
  startedAt: { type: Date },
  completedAt: { type: Date },
  notes: { type: String, default: '' },
  victimFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
  },
}, { timestamps: true })

missionSchema.index({ volunteerId: 1, status: 1 })

missionSchema.set('toJSON', {
  transform(doc, ret) {
    ret.missionId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

module.exports = {
  SOSRequest: mongoose.model('SOSRequest', sosRequestSchema),
  Mission: mongoose.model('Mission', missionSchema),
}
