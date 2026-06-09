const Inventory = require('./inventoryModel')

async function list(req, res, next) {
  try {
    const items = await Inventory.find().populate('itemCategoryId').sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) { next(err) }
}

async function getById(req, res, next) {
  try {
    const item = await Inventory.findById(req.params.id).populate('itemCategoryId')
    if (!item) return res.status(404).json({ error: 'Inventory item not found' })
    res.json({ item })
  } catch (err) { next(err) }
}

async function create(req, res, next) {
  try {
    const { itemCategoryId, totalQuantity, unit, notes } = req.body
    const existing = await Inventory.findOne({ itemCategoryId })
    if (existing) return res.status(409).json({ error: 'Inventory for this item already exists' })
    const item = await Inventory.create({ itemCategoryId, totalQuantity, unit, notes })
    res.status(201).json({ item })
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const { totalQuantity, unit, notes } = req.body
    const updates = {}
    if (totalQuantity !== undefined) updates.totalQuantity = totalQuantity
    if (unit) updates.unit = unit
    if (notes !== undefined) updates.notes = notes
    if (totalQuantity !== undefined) updates.lastRestockedAt = new Date()
    const item = await Inventory.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!item) return res.status(404).json({ error: 'Inventory item not found' })
    res.json({ item })
  } catch (err) { next(err) }
}

module.exports = { list, getById, create, update }
