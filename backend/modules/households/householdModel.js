const mongoose = require('mongoose')

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0, max: 150 },
  idType: { type: String, enum: ['NID', 'BIRTH'], required: true },
  idNumber: { type: String, required: true, trim: true },
}, { _id: false })

const householdSchema = new mongoose.Schema({
  headName: { type: String, required: true, trim: true },
  nid: { type: String, required: true, unique: true },
  gps: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  familySize: { type: Number, min: 1 },
  familyMembers: { type: [familyMemberSchema], default: undefined },
  vulnerabilityFlags: {
    elderly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    pregnant: { type: Boolean, default: false },
  },
  photoUrl: { type: String, default: null },
  jurisdictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jurisdiction', required: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

householdSchema.pre('validate', function (next) {
  if (this.familyMembers && this.familyMembers.length > 0) {
    this.familySize = this.familyMembers.length
  }
  next()
})

householdSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    ret.hhId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Household', householdSchema)
