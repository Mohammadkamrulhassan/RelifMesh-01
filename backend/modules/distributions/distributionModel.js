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
  pledgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReliefPledge', default: null },
}, { timestamps: true })

// Pre-save hook: decrement distributed_qty on linked pledge
distributionLogSchema.pre('save', async function (next) {
  if (!this.isNew || !this.pledgeId) return next()
  try {
    const ReliefPledge = mongoose.model('ReliefPledge')
    await ReliefPledge.findByIdAndUpdate(this.pledgeId, {
      $inc: { distributed_qty: this.quantity },
      $set: { status: 'IN_FULFILLMENT' },
    })
    next()
  } catch (err) { next(err) }
})

// Post-remove hook: restore distributed_qty on linked pledge
distributionLogSchema.post('findOneAndDelete', async function (doc) {
  if (!doc || !doc.pledgeId) return
  try {
    const ReliefPledge = mongoose.model('ReliefPledge')
    await ReliefPledge.findByIdAndUpdate(doc.pledgeId, {
      $inc: { distributed_qty: -doc.quantity },
    })
  } catch (err) {
    console.error('Failed to update pledge distributed_qty:', err.message)
  }
})

module.exports = mongoose.model('DistributionLog', distributionLogSchema)
