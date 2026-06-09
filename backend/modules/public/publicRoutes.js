const { Router } = require('express')
const ctrl = require('./publicController')
const authenticate = require('../../middleware/authenticate')

const router = Router()
router.get('/dashboard', ctrl.dashboard)
router.get('/map', ctrl.mapData)
router.get('/item-categories', ctrl.itemCategories)
router.get('/admin-dashboard', authenticate, ctrl.adminDashboard)

module.exports = router
