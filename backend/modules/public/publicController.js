const DistributionLog = require('../distributions/distributionModel')
const Household = require('../households/householdModel')

async function dashboard(req, res, next) {
  try {
    const totalHouseholds = await Household.countDocuments()
    const totalDistributions = await DistributionLog.countDocuments()
    const unions = await DistributionLog.aggregate([
      { $group: { _id: '$itemCategoryId', count: { $sum: 1 } } },
      { $lookup: { from: 'itemcategories', localField: '_id', foreignField: '_id', as: 'item' } },
    ])
    res.json({ totalHouseholds, totalDistributions, unions })
  } catch (err) { next(err) }
}

async function mapData(req, res, next) {
  try {
    const data = await DistributionLog.aggregate([
      { $group: { _id: '$householdId', count: { $sum: 1 } } },
      { $limit: 200 },
    ])
    res.json({ data })
  } catch (err) { next(err) }
}

module.exports = { dashboard, mapData }
