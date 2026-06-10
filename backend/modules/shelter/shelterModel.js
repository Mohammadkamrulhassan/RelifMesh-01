const mongoose = require('mongoose')

const shelterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  address: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
  currentOccupancy: { type: Number, default: 0, min: 0 },
  facilities: [{ type: String }],
  contactNumber: { type: String, default: null },
  inChargeUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

shelterSchema.index({ location: '2dsphere' })
shelterSchema.index({ isActive: 1 })

shelterSchema.set('toJSON', {
  transform(doc, ret) {
    ret.shelterId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

const inventoryTransactionSchema = new mongoose.Schema({
  inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  type: { type: String, enum: ['in', 'out', 'expired', 'damaged'], required: true },
  quantity: { type: Number, required: true },
  referenceType: {
    type: String, enum: ['donation', 'relief_request', 'transfer', 'adjustment'], default: null,
  },
  referenceId: { type: mongoose.Schema.Types.ObjectId, default: null },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, default: '' },
}, { timestamps: true })

inventoryTransactionSchema.index({ inventoryId: 1, createdAt: -1 })
inventoryTransactionSchema.index({ referenceType: 1, referenceId: 1 })

inventoryTransactionSchema.set('toJSON', {
  transform(doc, ret) {
    ret.transactionId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

module.exports = {
  Shelter: mongoose.model('Shelter', shelterSchema),
  InventoryTransaction: mongoose.model('InventoryTransaction', inventoryTransactionSchema),
}
