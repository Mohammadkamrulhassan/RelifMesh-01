const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  passwordHash: { type: String },
  phone: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    enum: [
      'UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER', 'CITIZEN',
      'victim', 'volunteer', 'ngo', 'govt', 'donor', 'admin', 'super_admin',
    ],
    required: true,
  },
  organization: { type: String, default: null },
  jurisdictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jurisdiction' },
  address: { type: String, default: null },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

userSchema.set('toJSON', {
  transform(doc, ret) {
    ret.userId = ret._id.toString()
    delete ret.passwordHash
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('User', userSchema)
