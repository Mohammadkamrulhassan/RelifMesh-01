const { Router } = require('express')
const { validationResult } = require('express-validator')
const ctrl = require('./reliefRequestController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')
const { validateReliefRequest, validateReview } = require('./reliefRequestValidation')

const router = Router()
router.use(authenticate)

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() })
  }
  next()
}

router.post('/', authorize('CITIZEN'), validateReliefRequest, handleValidation, ctrl.create)
router.get('/mine', authorize('CITIZEN'), ctrl.listMyRequests)
router.get('/mine/:id', authorize('CITIZEN'), ctrl.getById)
router.put('/mine/:id/cancel', authorize('CITIZEN'), ctrl.cancel)

router.get('/admin', authorize('UPAZILA_OFFICER', 'UP_OFFICIAL', 'NGO_WORKER'), ctrl.listAll)
router.put('/admin/:id/review', authorize('UPAZILA_OFFICER', 'UP_OFFICIAL'), validateReview, handleValidation, ctrl.review)

module.exports = router
