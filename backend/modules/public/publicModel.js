const mongoose = require('mongoose')

const itemCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory', default: null },
  isActive: { type: Boolean, default: true },
})

const jurisdictionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: {
    type: String,
    enum: ['DISTRICT', 'UPAZILA', 'UNION'],
    required: true,
  },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jurisdiction', default: null },
})

const syncConflictSchema = new mongoose.Schema({
  documentId: { type: String, required: true },
  localVersion: { type: mongoose.Schema.Types.Mixed },
  serverVersion: { type: mongoose.Schema.Types.Mixed },
  resolutionStatus: {
    type: String,
    enum: ['PENDING', 'RESOLVED', 'AUTO'],
    default: 'PENDING',
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true })

const ItemCategory = mongoose.model('ItemCategory', itemCategorySchema)
const Jurisdiction = mongoose.model('Jurisdiction', jurisdictionSchema)
const SyncConflict = mongoose.model('SyncConflict', syncConflictSchema)

module.exports = { ItemCategory, Jurisdiction, SyncConflict }
