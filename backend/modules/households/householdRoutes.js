const { Router } = require('express')
const ctrl = require('./householdController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()
router.use(authenticate)

router.get('/search', ctrl.search)
router.get('/', ctrl.list)
router.get('/:id', ctrl.getById)
router.post('/', authorize('UP_OFFICIAL'), ctrl.create)
router.put('/:id', authorize('UP_OFFICIAL'), ctrl.update)

module.exports = router
