const { Router } = require('express')
const ctrl = require('./needController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()

// Public endpoints (no auth required for public dashboard)
router.get('/heatmap', ctrl.heatmap)

// Authenticated endpoints
router.use(authenticate)

router.get('/', ctrl.list)
router.get('/summary', ctrl.summary)
router.get('/:id', ctrl.getById)
router.post('/calculate', authorize('UPAZILA_OFFICER'), ctrl.calculate)
router.put('/:id/override', authorize('UPAZILA_OFFICER'), ctrl.setOverride)

module.exports = router
