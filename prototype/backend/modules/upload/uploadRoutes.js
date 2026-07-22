const { Router } = require('express')
const upload = require('../../middleware/upload')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')

const router = Router()

router.post('/image', authenticate, authorize('UP_OFFICIAL', 'UPAZILA_OFFICER', 'NGO_WORKER'), (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename })
  })
})

module.exports = router
