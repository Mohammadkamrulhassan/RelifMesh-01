const mongoose = require('mongoose')

const needAssessmentSchema = new mongoose.Schema({
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'GeographicArea', required: true },
  itemCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory', required: true },
  calculated_qty: { type: Number, required: true, min: 0 },
  override_qty: { type: Number, default: null, min: 0 },
  override_reason: { type: String, default: null },
  overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  calculated_at: { type: Date, default: Date.now },
  calculated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  coverageDays: { type: Number, default: 7, min: 1, max: 90 },
  demographics: {
    totalPopulation: { type: Number, default: 0 },
    children_0_5: { type: Number, default: 0 },
    over_60: { type: Number, default: 0 },
    adults_18_59: { type: Number, default: 0 },
  },
}, { timestamps: true })

needAssessmentSchema.index({ areaId: 1, itemCategoryId: 1 }, { unique: true })
needAssessmentSchema.index({ areaId: 1 })

needAssessmentSchema.virtual('effective_qty').get(function () {
  return this.override_qty != null ? this.override_qty : this.calculated_qty
})

needAssessmentSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('NeedAssessment', needAssessmentSchema)
