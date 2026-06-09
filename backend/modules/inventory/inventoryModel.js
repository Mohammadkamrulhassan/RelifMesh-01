const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  itemCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory', required: true, unique: true },
  totalQuantity: { type: Number, required: true, min: 0, default: 0 },
  unit: { type: String, required: true },
  distributedQuantity: { type: Number, default: 0, min: 0 },
  lastRestockedAt: { type: Date, default: null },
  notes: { type: String, default: null },
}, { timestamps: true })

inventorySchema.virtual('remainingQuantity').get(function () {
  return this.totalQuantity - this.distributedQuantity
})

inventorySchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    ret.inventoryId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Inventory', inventorySchema)
