const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const ctrl = require('./authController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() })
  }
  next()
}

router.post('/login',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 1 }).withMessage('Password required'),
  handleValidation,
  ctrl.login,
)

router.post('/register',
  authenticate,
  authorize('UPAZILA_OFFICER'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name required'),
  body('role').isIn(['UP_OFFICIAL', 'NGO_WORKER']).withMessage('Valid role required'),
  handleValidation,
  ctrl.register,
)

router.post('/register/citizen',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name required'),
  body('phone').optional({ values: 'falsy' }).trim(),
  body('address').optional({ values: 'falsy' }).trim(),
  handleValidation,
  ctrl.registerCitizen,
)

router.get('/profile', authenticate, ctrl.getProfile)
router.put('/profile', authenticate, ctrl.updateProfile)
router.get('/users', authenticate, authorize('UPAZILA_OFFICER'), ctrl.listUsers)
router.patch('/users/:id', authenticate, authorize('UPAZILA_OFFICER'), ctrl.updateUser)

module.exports = router
