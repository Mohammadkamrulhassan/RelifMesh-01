const { Router } = require('express')
const { login, register } = require('./authController')
const authenticate = require('../../middleware/authenticate')
const authorize = require('../../middleware/authorize')
const { body } = require('express-validator')

const router = Router()

router.post('/login', login)

router.post('/register',
  authenticate,
  authorize('UPAZILA_OFFICER'),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  register
)

module.exports = router
