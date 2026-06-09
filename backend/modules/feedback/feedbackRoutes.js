const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const ctrl = require('./feedbackController')
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

router.post('/',
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters'),
  handleValidation,
  ctrl.create,
)

router.get('/', authenticate, authorize('UPAZILA_OFFICER', 'UP_OFFICIAL'), ctrl.list)
router.get('/:id', authenticate, ctrl.getById)
router.put('/:id/respond', authenticate, authorize('UPAZILA_OFFICER', 'UP_OFFICIAL'), body('response').trim().isLength({ min: 2 }), handleValidation, ctrl.respond)

module.exports = router
