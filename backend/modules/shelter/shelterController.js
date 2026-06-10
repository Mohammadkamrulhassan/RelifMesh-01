const { Shelter, InventoryTransaction } = require('./shelterModel')

async function create(req, res, next) {
  try {
    const data = { ...req.body }
    if (data.location && Array.isArray(data.location.coordinates)) {
      data.location.coordinates = data.location.coordinates.map(Number)
    }
    const shelter = await Shelter.create(data)
    res.status(201).json({ success: true, data: shelter })
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const { page = 1, limit = 20, isActive } = req.query
    const filter = {}
    if (isActive !== undefined) filter.isActive = isActive === 'true'
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [shelters, total] = await Promise.all([
      Shelter.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Shelter.countDocuments(filter),
    ])
    res.json({
      success: true, data: shelters,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    })
  } catch (err) { next(err) }
}

async function getById(req, res, next) {
  try {
    const shelter = await Shelter.findById(req.params.id)
    if (!shelter) return res.status(404).json({ success: false, message: 'Shelter not found' })
    res.json({ success: true, data: shelter })
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!shelter) return res.status(404).json({ success: false, message: 'Shelter not found' })
    res.json({ success: true, data: shelter })
  } catch (err) { next(err) }
}

async function updateOccupancy(req, res, next) {
  try {
    const { currentOccupancy } = req.body
    if (currentOccupancy === undefined) return res.status(400).json({ success: false, message: 'currentOccupancy required' })
    const shelter = await Shelter.findById(req.params.id)
    if (!shelter) return res.status(404).json({ success: false, message: 'Shelter not found' })
    if (currentOccupancy > shelter.capacity) {
      return res.status(400).json({ success: false, message: 'Occupancy exceeds capacity' })
    }
    shelter.currentOccupancy = currentOccupancy
    await shelter.save()
    res.json({ success: true, data: shelter })
  } catch (err) { next(err) }
}

async function createTransaction(req, res, next) {
  try {
    const data = { ...req.body, performedBy: req.user.sub }
    const txn = await InventoryTransaction.create(data)
    res.status(201).json({ success: true, data: txn })
  } catch (err) { next(err) }
}

async function listTransactions(req, res, next) {
  try {
    const { page = 1, limit = 20, inventoryId, type } = req.query
    const filter = {}
    if (inventoryId) filter.inventoryId = inventoryId
    if (type) filter.type = type
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [txns, total] = await Promise.all([
      InventoryTransaction.find(filter).populate('performedBy', 'name role')
        .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      InventoryTransaction.countDocuments(filter),
    ])
    res.json({
      success: true, data: txns,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    })
  } catch (err) { next(err) }
}

module.exports = {
  create, list, getById, update, updateOccupancy,
  createTransaction, listTransactions,
}
