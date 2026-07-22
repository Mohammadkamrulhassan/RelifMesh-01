const mongoose = require('mongoose')

const duplicateAlertSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  priorLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'DistributionLog', required: true },
  triggeredLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'DistributionLog', default: null },
  itemCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory', required: true },
  isResolved: { type: Boolean, default: false },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  overrideReason: { type: String, default: null },
}, { timestamps: true })

module.exports = mongoose.model('DuplicateAlert', duplicateAlertSchema)
