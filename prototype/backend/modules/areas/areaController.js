const GeographicArea = require('./areaModel')

async function create(req, res, next) {
  try {
    const area = await GeographicArea.create(req.body)
    res.status(201).json({ area })
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const { level, parentId, page = 1, limit = 100 } = req.query
    const filter = {}
    if (level) filter.level = level
    if (parentId) filter.parentId = parentId
    else filter.parentId = null
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [areas, total] = await Promise.all([
      GeographicArea.find(filter).sort({ name: 1 }).skip(skip).limit(parseInt(limit)),
      GeographicArea.countDocuments(filter),
    ])
    res.json({ areas, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) { next(err) }
}

async function getById(req, res, next) {
  try {
    const area = await GeographicArea.findById(req.params.id)
    if (!area) return res.status(404).json({ error: 'Area not found' })
    res.json({ area })
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const area = await GeographicArea.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!area) return res.status(404).json({ error: 'Area not found' })
    res.json({ area })
  } catch (err) { next(err) }
}

async function remove(req, res, next) {
  try {
    const children = await GeographicArea.countDocuments({ parentId: req.params.id })
    if (children > 0) return res.status(400).json({ error: 'Cannot delete area with child areas' })
    const area = await GeographicArea.findByIdAndDelete(req.params.id)
    if (!area) return res.status(404).json({ error: 'Area not found' })
    res.json({ message: 'Area deleted' })
  } catch (err) { next(err) }
}

async function getChildren(req, res, next) {
  try {
    const { id } = req.params
    const children = await GeographicArea.find({ parentId: id }).sort({ name: 1 })
    res.json({ areas: children })
  } catch (err) { next(err) }
}

async function getHierarchy(req, res, next) {
  try {
    const divisions = await GeographicArea.find({ level: 'DIVISION' }).sort({ name: 1 })
    const result = []
    for (const division of divisions) {
      const districts = await GeographicArea.find({ level: 'DISTRICT', parentId: division._id }).sort({ name: 1 })
      const dItems = []
      for (const district of districts) {
        const upazilas = await GeographicArea.find({ level: 'UPAZILA', parentId: district._id }).sort({ name: 1 })
        const uItems = []
        for (const upazila of upazilas) {
          const unions = await GeographicArea.find({ level: 'UNION', parentId: upazila._id }).sort({ name: 1 })
          const uItemsWithWards = []
          for (const union of unions) {
            const wards = await GeographicArea.find({ level: 'WARD', parentId: union._id }).sort({ name: 1 })
            uItemsWithWards.push({ ...union.toJSON(), children: wards })
          }
          uItems.push({ ...upazila.toJSON(), children: uItemsWithWards })
        }
        dItems.push({ ...district.toJSON(), children: uItems })
      }
      result.push({ ...division.toJSON(), children: dItems })
    }
    res.json({ hierarchy: result })
  } catch (err) { next(err) }
}

async function getTree(req, res, next) {
  try {
    const { id } = req.params
    const area = await GeographicArea.findById(id)
    if (!area) return res.status(404).json({ error: 'Area not found' })
    const children = await GeographicArea.find({ parentId: id }).sort({ name: 1 })
    res.json({ area, children })
  } catch (err) { next(err) }
}

module.exports = { create, list, getById, update, remove, getChildren, getHierarchy, getTree }
