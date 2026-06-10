const mongoose = require('mongoose')

const distributionLogSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory', required: true },
  quantity: { type: Number, required: true, min: 0.01 },
  unit: { type: String, required: true },
  gps: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  photoUrl: { type: String, default: null },
  distributedAt: { type: Date, required: true, default: Date.now },
  syncStatus: {
    type: String,
    enum: ['PENDING', 'SYNCED', 'CONFLICT'],
    default: 'SYNCED',
  },
  isOverride: { type: Boolean, default: false },
  overrideReason: { type: String, default: null },
}, { timestamps: true })

module.exports = mongoose.model('DistributionLog', distributionLogSchema)
