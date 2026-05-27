const Household = require('./householdModel')

async function create(req, res, next) {
  try {
    const data = { ...req.body, registeredBy: req.user.sub, jurisdictionId: req.user.jurisdictionId }
    const household = await Household.create(data)
    res.status(201).json({ household })
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const filter = { jurisdictionId: req.user.jurisdictionId }
    const households = await Household.find(filter).sort({ createdAt: -1 })
    res.json({ households })
  } catch (err) { next(err) }
}

async function getById(req, res, next) {
  try {
    const household = await Household.findById(req.params.id)
    if (!household) return res.status(404).json({ error: 'Household not found' })
    res.json({ household })
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const household = await Household.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!household) return res.status(404).json({ error: 'Household not found' })
    res.json({ household })
  } catch (err) { next(err) }
}

async function search(req, res, next) {
  try {
    const { q } = req.query
    const households = await Household.find({
      jurisdictionId: req.user.jurisdictionId,
      $or: [
        { headName: { $regex: q, $options: 'i' } },
        { nid: { $regex: q, $options: 'i' } },
      ],
    }).limit(20)
    res.json({ households })
  } catch (err) { next(err) }
}

module.exports = { create, list, getById, update, search }
