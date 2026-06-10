const { body } = require('express-validator')

const validateFamilyMember = [
  body('familyMembers.*.name').trim().isLength({ min: 1, max: 100 }),
  body('familyMembers.*.age').isInt({ min: 0, max: 150 }),
  body('familyMembers.*.idType').isIn(['NID', 'BIRTH']),
  body('familyMembers.*.idNumber').trim().isLength({ min: 1, max: 30 }),
]

const validateHousehold = [
  body('headName').trim().isLength({ min: 2, max: 100 }),
  body('nid').matches(/^[0-9]{6,20}$/).withMessage('NID must be 6–20 digits'),
  body('familySize').optional({ values: 'falsy' }).isInt({ min: 1, max: 50 }),
  body('gps.lat').isFloat({ min: -90, max: 90 }),
  body('gps.lng').isFloat({ min: -180, max: 180 }),
  ...validateFamilyMember,
]

module.exports = { validateHousehold }
