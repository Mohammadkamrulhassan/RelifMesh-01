const DuplicateAlert = require('./alertModel')

async function list(req, res, next) {
  try {
    const alerts = await DuplicateAlert.find()
      .populate('householdId')
      .populate('priorLogId')
      .sort({ createdAt: -1 })
    res.json({ alerts })
  } catch (err) { next(err) }
}

async function resolve(req, res, next) {
  try {
    const alert = await DuplicateAlert.findByIdAndUpdate(
      req.params.id,
      { isResolved: true, resolvedBy: req.user.sub, overrideReason: req.body.reason },
      { new: true }
    )
    if (!alert) return res.status(404).json({ error: 'Alert not found' })
    res.json({ alert })
  } catch (err) { next(err) }
}

module.exports = { list, resolve }
