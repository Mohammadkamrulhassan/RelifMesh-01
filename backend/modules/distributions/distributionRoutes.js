const { Router } = require('express')
const { validationResult } = require('express-validator')
const ctrl = require('./distributionController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')
const { validateDistribution } = require('./distributionValidation')

const router = Router()
router.use(authenticate)

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() })
  }
  next()
}

router.get('/duplicate-check', ctrl.duplicateCheck)
router.get('/', ctrl.list)
router.post('/', authorize('UP_OFFICIAL', 'NGO_WORKER'), validateDistribution, handleValidation, ctrl.create)

module.exports = router
