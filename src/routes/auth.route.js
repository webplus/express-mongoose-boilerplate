const express = require('express')
const validate = require('express-validation')
const passport = require('passport')
// const jwt = require('express-jwt')
// const config = require('../config/index')
const tokenManager = require('../config/token')
const paramValidation = require('../config/paramValidation')
const authCtrl = require('../controllers/auth.controller')
const router = express.Router()  // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login)

router.get('/logout', tokenManager.verify, authCtrl.logout)

router.route('/register')
  .post(validate(paramValidation.register), authCtrl.register)

/** GET /api/auth/random-number - 受保护 route,
 * needs token returned by the above as header. Authorization: Bearer {token}
 */
router.route('/random-number')
  .get(tokenManager.verify, authCtrl.getRandomNumber)
  // .get(jwt({ secret: config.app.jwtSecret }), tokenManager.verify, authCtrl.getRandomNumber)

// Protect dashboard route with JWT
router.get('/dashboard', passport.authenticate('jwt', { session: false }), function (req, res) {
  res.send('Auth works! User id is: ' + req.user._id + '.')
})

module.exports = router
