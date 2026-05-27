const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER'],
    required: true,
  },
  organization: { type: String, default: null },
  jurisdictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jurisdiction', required: true },
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
