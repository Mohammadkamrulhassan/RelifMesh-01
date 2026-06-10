const { body } = require('express-validator')

const validateDistribution = [
  body('householdId').isMongoId(),
  body('itemCategoryId').isMongoId(),
  body('quantity').isFloat({ min: 0.01 }),
  body('unit').notEmpty(),
  body('gps.lat').isFloat({ min: -90, max: 90 }),
  body('gps.lng').isFloat({ min: -180, max: 180 }),
]

module.exports = { validateDistribution }
