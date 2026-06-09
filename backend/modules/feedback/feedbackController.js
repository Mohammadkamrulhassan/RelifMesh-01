const Feedback = require('./feedbackModel')

async function create(req, res, next) {
  try {
    const { householdId, name, contact, category, message } = req.body
    const feedback = await Feedback.create({
      householdId: householdId || null,
      submittedBy: req.user?.sub || null,
      name,
      contact,
      category,
      message,
    })
    res.status(201).json({ feedback })
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const { page = 1, limit = 20, category, isRead } = req.query
    const filter = {}
    if (category) filter.category = category
    if (isRead !== undefined) filter.isRead = isRead === 'true'
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter)
        .populate('respondedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Feedback.countDocuments(filter),
    ])
    res.json({ feedbacks, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) { next(err) }
}

async function getById(req, res, next) {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('respondedBy', 'name email')
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' })
    res.json({ feedback })
  } catch (err) { next(err) }
}

async function respond(req, res, next) {
  try {
    const { response } = req.body
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { response, isRead: true, respondedBy: req.user.sub, respondedAt: new Date() },
      { new: true }
    )
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' })
    res.json({ feedback })
  } catch (err) { next(err) }
}

module.exports = { create, list, getById, respond }
