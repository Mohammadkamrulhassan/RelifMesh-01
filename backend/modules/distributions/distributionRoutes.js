const { Router } = require('express')
const ctrl = require('./distributionController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()
router.use(authenticate)

router.get('/duplicate-check', ctrl.duplicateCheck)
router.get('/', ctrl.list)
router.post('/', authorize('UP_OFFICIAL', 'NGO_WORKER'), ctrl.create)

module.exports = router
