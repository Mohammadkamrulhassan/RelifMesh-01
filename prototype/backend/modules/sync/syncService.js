const DistributionLog = require('../distributions/distributionModel')
const { SyncConflict } = require('../public/publicModel')
const { lastWriteWins } = require('../../utils/conflictResolver')

async function processPush(records) {
  const result = { synced: 0, conflicts: 0, errors: [] }

  for (const r of records) {
    try {
      const match = await DistributionLog.findOne({
        householdId: r.householdId,
        itemCategoryId: r.itemCategoryId,
        distributedAt: r.distributedAt,
      })

      const record = { ...r }
      delete record._id

      if (!match) {
        await DistributionLog.create({ ...record, syncStatus: 'SYNCED' })
        result.synced++
        continue
      }

      const winner = lastWriteWins(record, match.toObject())
      if (winner === record) {
        await DistributionLog.findByIdAndUpdate(match._id, { ...record, syncStatus: 'SYNCED' }, { new: true })
        result.synced++
      } else {
        await SyncConflict.create({
          documentId: match._id.toString(),
          localVersion: r,
          serverVersion: match.toObject(),
          resolutionStatus: 'PENDING',
        })
        result.conflicts++
      }
    } catch (err) {
      result.errors.push(err.message)
    }
  }

  return result
}

module.exports = { processPush }
