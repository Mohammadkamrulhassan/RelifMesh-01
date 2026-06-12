const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const ctrl = require('./shelterController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', error: { code: 'VALIDATION_ERROR', details: errors.array() } })
  }
  next()
}

router.get('/', ctrl.list)
router.get('/:id', ctrl.getById)

router.post('/',
  authenticate, authorize('govt', 'admin', 'super_admin'),
  body('name').notEmpty().trim(),
  body('location').isObject(),
  body('location.coordinates').isArray({ min: 2, max: 2 }),
  body('address').notEmpty(),
  body('capacity').isInt({ min: 1 }),
  handleValidation,
  ctrl.create,
)
router.patch('/:id', authenticate, authorize('govt', 'admin', 'super_admin'), ctrl.update)
router.patch('/:id/occupancy', authenticate, authorize('admin', 'super_admin'), ctrl.updateOccupancy)

router.get('/transactions', authenticate, ctrl.listTransactions)
router.post('/transactions',
  authenticate, authorize('ngo', 'govt', 'admin', 'super_admin'),
  body('inventoryId').isMongoId(),
  body('type').isIn(['in', 'out', 'expired', 'damaged']),
  body('quantity').isFloat({ min: 0.1 }),
  handleValidation,
  ctrl.createTransaction,
)

module.exports = router
