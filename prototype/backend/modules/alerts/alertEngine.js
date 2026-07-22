const DistributionLog = require('../distributions/distributionModel')

async function checkDuplicate(householdId, itemCategoryId) {
  const existing = await DistributionLog.findOne({
    householdId,
    itemCategoryId,
    distributedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  }).sort({ distributedAt: -1 })
  return existing
}

module.exports = { checkDuplicate }
