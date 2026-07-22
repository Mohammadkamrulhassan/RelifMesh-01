const Household = require('./householdModel')
const User = require('../auth/authModel')

async function create(req, res, next) {
  try {
    let jurisdictionId = req.user.jurisdictionId
    if (!jurisdictionId) {
      const user = await User.findById(req.user.sub)
      if (!user) return res.status(404).json({ error: 'User not found' })
      jurisdictionId = user.jurisdictionId
      if (!jurisdictionId) return res.status(400).json({ error: 'Your account has no jurisdiction assigned. Contact an administrator.' })
    }
    const data = { ...req.body, registeredBy: req.user.sub, jurisdictionId }
    const household = await Household.create(data)
    res.status(201).json({ household })
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const { page = 1, limit = 20, q } = req.query
    const filter = {}
    if (req.user.role !== 'UPAZILA_OFFICER') {
      filter.jurisdictionId = req.user.jurisdictionId
    }
    if (q) {
      filter.$or = [
        { headName: { $regex: q, $options: 'i' } },
        { nid: { $regex: q, $options: 'i' } },
      ]
    }
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [households, total] = await Promise.all([
      Household.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Household.countDocuments(filter),
    ])
    res.json({ households, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
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
    const filter = { $or: [
      { headName: { $regex: q, $options: 'i' } },
      { nid: { $regex: q, $options: 'i' } },
    ]}
    if (req.user.role !== 'UPAZILA_OFFICER') {
      filter.jurisdictionId = req.user.jurisdictionId
    }
    const households = await Household.find(filter).limit(20)
    res.json({ households })
  } catch (err) { next(err) }
}

module.exports = { create, list, getById, update, search }
