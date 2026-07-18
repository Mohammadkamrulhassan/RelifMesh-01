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
  children_0_5: { type: Number, default: 0, min: 0 },
  over_60: { type: Number, default: 0, min: 0 },
  adults_18_59: { type: Number, default: 0, min: 0 },
  vulnerabilityFlags: {
    elderly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    pregnant: { type: Boolean, default: false },
  },
  photoUrl: { type: String, default: null },
  jurisdictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'GeographicArea', required: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

householdSchema.pre('validate', function (next) {
  if (this.familyMembers && this.familyMembers.length > 0) {
    this.familySize = this.familyMembers.length
    // Auto-compute age brackets from family members
    let c05 = 0, ov60 = 0, a1859 = 0
    for (const m of this.familyMembers) {
      if (m.age <= 5) c05++
      else if (m.age >= 60) ov60++
      else if (m.age >= 18) a1859++
    }
    if (this.children_0_5 === undefined || this.children_0_5 === 0) this.children_0_5 = c05
    if (this.over_60 === undefined || this.over_60 === 0) this.over_60 = ov60
    if (this.adults_18_59 === undefined || this.adults_18_59 === 0) this.adults_18_59 = a1859
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
