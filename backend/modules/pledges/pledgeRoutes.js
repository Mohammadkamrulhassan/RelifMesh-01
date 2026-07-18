const { Router } = require('express')
const ctrl = require('./pledgeController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()
router.use(authenticate)

router.get('/my', ctrl.myPledges)
router.get('/', ctrl.list)
router.get('/:id', ctrl.getById)
router.post('/', ctrl.create)
router.put('/:id', authorize('UPAZILA_OFFICER', 'NGO_WORKER'), ctrl.update)
router.put('/:id/status', ctrl.updateStatus)
router.delete('/:id', authorize('UPAZILA_OFFICER'), ctrl.remove)

module.exports = router
