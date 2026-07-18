const mongoose = require('mongoose')

const geographicAreaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  level: {
    type: String,
    enum: ['DIVISION', 'DISTRICT', 'UPAZILA', 'UNION', 'WARD'],
    required: true,
  },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'GeographicArea', default: null },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  population: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

geographicAreaSchema.index({ level: 1, parentId: 1 })
geographicAreaSchema.index({ name: 1, level: 1 }, { unique: true })

geographicAreaSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('GeographicArea', geographicAreaSchema)
