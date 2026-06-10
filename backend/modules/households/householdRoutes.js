const { Router } = require('express')
const { validationResult } = require('express-validator')
const ctrl = require('./householdController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')
const { validateHousehold } = require('./householdValidation')

const router = Router()
router.use(authenticate)

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() })
  }
  next()
}

router.get('/search', ctrl.search)
router.get('/', ctrl.list)
router.get('/:id', ctrl.getById)
router.post('/', authorize('UP_OFFICIAL', 'UPAZILA_OFFICER'), validateHousehold, handleValidation, ctrl.create)
router.put('/:id', authorize('UP_OFFICIAL', 'UPAZILA_OFFICER'), ctrl.update)

module.exports = router
