const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const ctrl = require('./chatController')
const authenticate = require('../../middleware/authenticate')

const router = Router()
router.use(authenticate)

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', error: { code: 'VALIDATION_ERROR', details: errors.array() } })
  }
  next()
}

router.get('/notifications', ctrl.getNotifications)
router.patch('/notifications/read-all', ctrl.markAllRead)
router.patch('/notifications/:id/read', ctrl.markRead)

router.get('/:missionId', ctrl.getMessages)
router.post('/:missionId',
  body('message').notEmpty().trim(),
  handleValidation,
  ctrl.sendMessage,
)

module.exports = router
