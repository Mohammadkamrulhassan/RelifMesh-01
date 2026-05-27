const DistributionLog = require('../distributions/distributionModel')
const { generatePDF, generateCSV } = require('./reportGenerator')

async function exportReport(req, res, next) {
  try {
    const filter = {}
    if (req.query.unionId) filter['householdId'] = req.query.unionId
    if (req.query.startDate) filter.distributedAt = { $gte: new Date(req.query.startDate) }
    if (req.query.endDate) {
      filter.distributedAt = { ...filter.distributedAt, $lte: new Date(req.query.endDate) }
    }

    const logs = await DistributionLog.find(filter)
      .populate('householdId officerId itemCategoryId')
      .lean()

    const rows = logs.map(l => ({
      household: l.householdId?.headName,
      nid: l.householdId?.nid,
      item: l.itemCategoryId?.name,
      quantity: l.quantity,
      unit: l.unit,
      officer: l.officerId?.name,
      date: l.distributedAt,
    }))

    const format = req.query.format || 'csv'
    if (format === 'pdf') return generatePDF(rows, res)
    generateCSV(rows, res)
  } catch (err) { next(err) }
}

module.exports = { exportReport }
