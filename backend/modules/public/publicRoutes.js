const { Router } = require('express')
const ctrl = require('./publicController')

const router = Router()
router.get('/dashboard', ctrl.dashboard)
router.get('/map', ctrl.mapData)

module.exports = router
