const { Campaign, Donation } = require('./campaignModel')

async function create(req, res, next) {
  try {
    const data = { ...req.body, ngoId: req.user.sub }
    if (data.startDate) data.startDate = new Date(data.startDate)
    if (data.endDate) data.endDate = new Date(data.endDate)
    const campaign = await Campaign.create(data)
    res.status(201).json({ success: true, data: campaign })
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const { page = 1, limit = 20, status } = req.query
    const filter = {}
    if (status) filter.status = status
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [campaigns, total] = await Promise.all([
      Campaign.find(filter).populate('ngoId', 'name phone').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Campaign.countDocuments(filter),
    ])
    res.json({
      success: true, data: campaigns,
      meta: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    })
  } catch (err) { next(err) }
}

async function getById(req, res, next) {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('ngoId', 'name phone')
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' })
    res.json({ success: true, data: campaign })
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const campaign = await Campaign.findById(req.params.id)
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' })
    if (campaign.ngoId.toString() !== req.user.sub && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    const allowed = ['title', 'description', 'goalAmount', 'startDate', 'endDate', 'status', 'coverImageUrl']
    allowed.forEach(f => { if (req.body[f] !== undefined) campaign[f] = req.body[f] })
    if (req.body.startDate) campaign.startDate = new Date(req.body.startDate)
    if (req.body.endDate) campaign.endDate = new Date(req.body.endDate)
    await campaign.save()
    res.json({ success: true, data: campaign })
  } catch (err) { next(err) }
}

async function verify(req, res, next) {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id, { isVerified: true, status: 'active' }, { new: true },
    )
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' })
    res.json({ success: true, data: campaign })
  } catch (err) { next(err) }
}

async function remove(req, res, next) {
  try {
    const campaign = await Campaign.findById(req.params.id)
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' })
    if (campaign.ngoId.toString() !== req.user.sub && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    campaign.status = 'cancelled'
    await campaign.save()
    res.json({ success: true, message: 'Campaign cancelled' })
  } catch (err) { next(err) }
}

async function createDonation(req, res, next) {
  try {
    const { campaignId, amount, paymentMethod, transactionId } = req.body
    const campaign = await Campaign.findById(campaignId)
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' })
    if (campaign.status !== 'active') return res.status(400).json({ success: false, message: 'Campaign is not active' })
    const donation = await Donation.create({
      campaignId, donorId: req.user.sub, amount, paymentMethod, transactionId, status: 'completed',
    })
    campaign.raisedAmount = (campaign.raisedAmount || 0) + amount
    if (campaign.raisedAmount >= campaign.goalAmount) campaign.status = 'completed'
    await campaign.save()

    const io = req.app.get('io')
    if (io) io.of('/admin').to('admin:dashboard').emit('donation:new', { donation, campaignId })

    res.status(201).json({ success: true, data: donation })
  } catch (err) { next(err) }
}

async function getMyDonations(req, res, next) {
  try {
    const donations = await Donation.find({ donorId: req.user.sub })
      .populate('campaignId', 'title')
      .sort({ createdAt: -1 })
    res.json({ success: true, data: donations })
  } catch (err) { next(err) }
}

async function getDonationById(req, res, next) {
  try {
    const donation = await Donation.findById(req.params.id).populate('campaignId', 'title')
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' })
    if (donation.donorId.toString() !== req.user.sub && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    res.json({ success: true, data: donation })
  } catch (err) { next(err) }
}

async function getCampaignDonations(req, res, next) {
  try {
    const campaign = await Campaign.findById(req.params.id)
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' })
    if (campaign.ngoId.toString() !== req.user.sub && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    const donations = await Donation.find({ campaignId: req.params.id })
      .populate('donorId', 'name phone').sort({ createdAt: -1 })
    res.json({ success: true, data: donations })
  } catch (err) { next(err) }
}

module.exports = {
  create, list, getById, update, verify, remove,
  createDonation, getMyDonations, getDonationById, getCampaignDonations,
}
