const DistributionLog = require('../distributions/distributionModel')
const { processPush } = require('./syncService')

async function push(req, res, next) {
  try {
    const records = req.body.records
    if (!Array.isArray(records)) return res.status(400).json({ error: 'records must be an array' })
    const result = await processPush(records)
    res.status(201).json(result)
  } catch (err) { next(err) }
}

async function pull(req, res, next) {
  try {
    const since = req.query.since ? new Date(req.query.since) : new Date(0)
    const logs = await DistributionLog.find({ updatedAt: { $gt: since } }).sort({ updatedAt: 1 })
    res.json({ records: logs, serverTime: new Date() })
  } catch (err) { next(err) }
}

module.exports = { push, pull }
