const { Router } = require('express')
const ctrl = require('./alertController')
const authenticate = require('../../middleware/authenticate')

const router = Router()
router.use(authenticate)

router.get('/', ctrl.list)
router.put('/:id/resolve', ctrl.resolve)

module.exports = router
