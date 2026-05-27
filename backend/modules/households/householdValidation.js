const { body } = require('express-validator')

const validateHousehold = [
  body('headName').trim().isLength({ min: 2, max: 100 }),
  body('nid').matches(/^[0-9]{10,17}$/),
  body('familySize').isInt({ min: 1, max: 50 }),
  body('gps.lat').isFloat({ min: -90, max: 90 }),
  body('gps.lng').isFloat({ min: -180, max: 180 }),
]

module.exports = { validateHousehold }
