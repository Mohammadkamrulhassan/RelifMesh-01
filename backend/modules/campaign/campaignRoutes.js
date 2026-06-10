const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const ctrl = require('./campaignController')
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
  authenticate, authorize('ngo', 'govt'),
  body('title').notEmpty().trim(),
  body('description').notEmpty(),
  body('goalAmount').isFloat({ min: 1 }),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  handleValidation,
  ctrl.create,
)
router.patch('/:id', authenticate, authorize('ngo', 'govt', 'admin', 'super_admin'), ctrl.update)
router.patch('/:id/verify', authenticate, authorize('admin', 'super_admin'), ctrl.verify)
router.delete('/:id', authenticate, ctrl.remove)
router.get('/:id/donations', authenticate, ctrl.getCampaignDonations)

router.post('/donations',
  authenticate, authorize('donor'),
  body('campaignId').isMongoId(),
  body('amount').isFloat({ min: 1 }),
  body('paymentMethod').isIn(['bkash', 'nagad', 'rocket', 'bank', 'cash']),
  handleValidation,
  ctrl.createDonation,
)
router.get('/donations/my', authenticate, ctrl.getMyDonations)
router.get('/donations/:id', authenticate, ctrl.getDonationById)

module.exports = router
