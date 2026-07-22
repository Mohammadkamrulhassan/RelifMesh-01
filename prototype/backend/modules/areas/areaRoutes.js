const { Router } = require('express')
const ctrl = require('./areaController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()

router.get('/hierarchy', ctrl.getHierarchy)
router.get('/', ctrl.list)
router.get('/:id', ctrl.getById)
router.get('/:id/children', ctrl.getChildren)
router.get('/:id/tree', ctrl.getTree)
router.use(authenticate)
router.post('/', authorize('UPAZILA_OFFICER'), ctrl.create)
router.put('/:id', authorize('UPAZILA_OFFICER'), ctrl.update)
router.delete('/:id', authorize('UPAZILA_OFFICER'), ctrl.remove)

module.exports = router
