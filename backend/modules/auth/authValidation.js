const { body, validationResult } = require('express-validator')

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
]

const validateRegister = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER', 'CITIZEN']),
  body('jurisdictionId').optional().isMongoId(),
]

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() })
  }
  next()
}

module.exports = { validateLogin, validateRegister, handleValidation }
