const mongoose = require('mongoose')

const reliefPledgeSchema = new mongoose.Schema({
  source_type: {
    type: String,
    enum: ['GOVERNMENT', 'NGO', 'INDIVIDUAL', 'CORPORATE'],
    required: true,
  },
  source_name: { type: String, required: true, trim: true },
  source_contact: { type: String, default: null },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'GeographicArea', default: null },
  customArea: { type: String, default: null, trim: true },
  itemCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory', required: true },
  total_qty: { type: Number, required: true, min: 0.01 },
  distributed_qty: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['PENDING', 'IN_FULFILLMENT', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  },
  pledge_date: { type: Date, default: Date.now },
  expected_delivery_date: { type: Date, default: null },
  fulfilled_date: { type: Date, default: null },
  notes: { type: String, default: null },
  pledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

reliefPledgeSchema.index({ areaId: 1, status: 1 })
reliefPledgeSchema.index({ pledgedBy: 1 })

reliefPledgeSchema.virtual('remaining_qty').get(function () {
  return Math.max(0, this.total_qty - this.distributed_qty)
})

reliefPledgeSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('ReliefPledge', reliefPledgeSchema)
