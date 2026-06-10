const { Router } = require('express')
const ctrl = require('./reportController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()
router.use(authenticate)
router.get('/export', authorize('UPAZILA_OFFICER'), ctrl.exportReport)

module.exports = router
