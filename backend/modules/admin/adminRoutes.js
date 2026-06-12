const { Router } = require('express')
const ctrl = require('./adminController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()

router.get('/dashboard', authenticate, authorize('admin', 'super_admin'), ctrl.getDashboard)
router.get('/heatmap-data', authenticate, authorize('admin', 'super_admin'), ctrl.getHeatmapData)
router.get('/analytics/sos', authenticate, authorize('admin', 'super_admin'), ctrl.getSosAnalytics)
router.get('/analytics/donations', authenticate, authorize('admin', 'super_admin'), ctrl.getDonationAnalytics)
router.get('/analytics/inventory', authenticate, authorize('admin', 'super_admin'), ctrl.getInventoryReports)
router.get('/audit-logs', authenticate, authorize('super_admin'), ctrl.getAuditLogs)
router.get('/alerts', authenticate, authorize('admin', 'super_admin'), ctrl.getAlerts)

module.exports = router
