const mongoose = require('mongoose')

const householdSchema = new mongoose.Schema({
  headName: { type: String, required: true, trim: true },
  nid: { type: String, required: true, unique: true },
  gps: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  familySize: { type: Number, required: true, min: 1 },
  vulnerabilityFlags: {
    elderly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    pregnant: { type: Boolean, default: false },
  },
  photoUrl: { type: String, default: null },
  jurisdictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jurisdiction', required: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

householdSchema.set('toJSON', {
  transform(doc, ret) {
    ret.hhId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Household', householdSchema)
