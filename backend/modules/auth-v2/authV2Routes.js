const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const ctrl = require('./authV2Controller')

const router = Router()

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() })
  }
  next()
}

router.post('/send-otp',
  body('phone').matches(/^\+?[1-9]\d{6,14}$/).withMessage('Valid phone number required (E.164 format)'),
  handleValidation,
  ctrl.sendOtp,
)

router.post('/verify-otp',
  body('phone').matches(/^\+?[1-9]\d{6,14}$/).withMessage('Valid phone number required'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('6-digit OTP required'),
  handleValidation,
  ctrl.verifyOtp,
)

router.post('/refresh',
  body('refreshToken').isString().withMessage('Refresh token required'),
  handleValidation,
  ctrl.refresh,
)

module.exports = router
