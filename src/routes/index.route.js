const express = require('express')
const userRoutes = require('./users.route')
const authRoutes = require('./auth.route')

// eslint-disable-line new-cap
const router = express.Router()

/** GET /health-check - Check service health */
router.get('/', (req, res) =>
  res.json({'code': 0, 'message': 'ok', 'data': ''})
)

// mount user routes at /users
router.use('/users', userRoutes)
// mount auth routes at /auth
router.use('/auth', authRoutes)

module.exports = router
