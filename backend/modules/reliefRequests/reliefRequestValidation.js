const { body } = require('express-validator')

const validateReliefRequest = [
  body('description').optional().trim().isLength({ min: 5, max: 500 }),
  body('items').isArray({ min: 1 }),
  body('items.*.itemCategoryId').isMongoId(),
  body('items.*.quantity').isFloat({ min: 0.01 }),
  body('items.*.unit').trim().isLength({ min: 1 }),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('location.lat').optional().isFloat({ min: -90, max: 90 }),
  body('location.lng').optional().isFloat({ min: -180, max: 180 }),
  body('location.address').optional().trim().isLength({ min: 3 }),
  body('householdId').optional().isMongoId(),
]

const validateReview = [
  body('status').isIn(['APPROVED', 'REJECTED']),
  body('reviewNotes').optional().trim().isLength({ min: 2, max: 500 }),
]

module.exports = { validateReliefRequest, validateReview }
