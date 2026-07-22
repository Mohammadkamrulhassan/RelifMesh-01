const { Router } = require('express')
const ctrl = require('./syncController')
const authenticate = require('../../middleware/authenticate')

const router = Router()
router.use(authenticate)
router.post('/push', ctrl.push)
router.get('/pull', ctrl.pull)

module.exports = router
