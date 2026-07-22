const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const ctrl = require('./inventoryController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()
router.use(authenticate)

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() })
  }
  next()
}

router.get('/', ctrl.list)
router.get('/:id', ctrl.getById)
router.post('/',
  authorize('UPAZILA_OFFICER'),
  body('itemCategoryId').isMongoId(),
  body('totalQuantity').isFloat({ min: 0 }),
  body('unit').notEmpty(),
  handleValidation,
  ctrl.create,
)
router.put('/:id', authorize('UPAZILA_OFFICER'), ctrl.update)

module.exports = router
