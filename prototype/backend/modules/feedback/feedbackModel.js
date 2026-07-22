const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  householdId: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', default: null },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true, trim: true },
  contact: { type: String, default: null },
  category: {
    type: String,
    enum: ['COMPLAINT', 'SUGGESTION', 'INQUIRY', 'APPRECIATION', 'OTHER'],
    default: 'OTHER',
  },
  message: { type: String, required: true, maxlength: 1000 },
  isRead: { type: Boolean, default: false },
  response: { type: String, default: null },
  respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  respondedAt: { type: Date, default: null },
}, { timestamps: true })

feedbackSchema.set('toJSON', {
  transform(doc, ret) {
    ret.feedbackId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

module.exports = mongoose.model('Feedback', feedbackSchema)
