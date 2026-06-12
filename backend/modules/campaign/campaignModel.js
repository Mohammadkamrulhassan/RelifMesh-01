const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalAmount: { type: Number, required: true, min: 1 },
  raisedAmount: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'BDT' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String, enum: ['draft', 'active', 'paused', 'completed', 'cancelled'], default: 'draft',
  },
  isVerified: { type: Boolean, default: false },
  coverImageUrl: { type: String, default: null },
}, { timestamps: true })

campaignSchema.index({ ngoId: 1 })
campaignSchema.index({ status: 1 })
campaignSchema.index({ endDate: 1 })

campaignSchema.set('toJSON', {
  transform(doc, ret) {
    ret.campaignId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

const donationSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 1 },
  paymentMethod: {
    type: String, enum: ['bkash', 'nagad', 'rocket', 'bank', 'cash'], required: true,
  },
  transactionId: { type: String, default: null },
  status: {
    type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending',
  },
  receiptUrl: { type: String, default: null },
}, { timestamps: true })

donationSchema.index({ campaignId: 1 })
donationSchema.index({ donorId: 1 })
donationSchema.index({ status: 1 })

donationSchema.set('toJSON', {
  transform(doc, ret) {
    ret.donationId = ret._id.toString()
    delete ret.__v
    return ret
  },
})

module.exports = {
  Campaign: mongoose.model('Campaign', campaignSchema),
  Donation: mongoose.model('Donation', donationSchema),
}
