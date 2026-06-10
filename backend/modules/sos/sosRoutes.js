const { Router } = require('express')
const { body, param, validationResult } = require('express-validator')
const ctrl = require('./sosController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()
router.use(authenticate)

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', error: { code: 'VALIDATION_ERROR', details: errors.array() } })
  }
  next()
}

router.post('/',
  authorize('victim'),
  body('type').isIn(['rescue', 'food', 'water', 'medical', 'shelter', 'other']),
  body('location').isObject(),
  body('location.coordinates').isArray({ min: 2, max: 2 }),
  body('location.coordinates.*').isFloat(),
  handleValidation,
  ctrl.create,
)

router.get('/', ctrl.list)
router.get('/active', ctrl.getActive)
router.get('/stats', ctrl.getStats)
router.get('/:id', ctrl.getById)
router.patch('/:id', ctrl.update)
router.patch('/:id/cancel', ctrl.cancel)

router.post('/missions',
  authorize('volunteer'),
  body('sosId').isMongoId(),
  handleValidation,
  ctrl.createMission,
)
router.get('/missions', ctrl.listMissions)
router.get('/missions/my', ctrl.getMyMissions)
router.get('/missions/:id', ctrl.getMissionById)
router.patch('/missions/:id/status',
  body('status').isIn(['en_route', 'on_site', 'rescued', 'completed', 'cancelled']),
  handleValidation,
  ctrl.updateMissionStatus,
)
router.patch('/missions/:id/notes', ctrl.updateMissionNotes)
router.post('/missions/:id/feedback',
  body('rating').isInt({ min: 1, max: 5 }),
  handleValidation,
  ctrl.submitFeedback,
)

module.exports = router
