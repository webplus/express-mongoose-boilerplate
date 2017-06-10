const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const httpStatus = require('http-status')
const APIError = require('../helpers/APIError')
const config = require('../config')
const UserModel = require('../models/user.model')

module.exports = function (passport) {
  let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.app.jwtSecret
    // issuer: 'www.pingan.com',
    // audience: ''
  }
  passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
    UserModel.findOne({id: jwtPayload.sub}, function (err, user) {
      if (err) {
        const error = new APIError('Authentication error', httpStatus.UNAUTHORIZED)
        return done(error, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
        // or you could create a new account
      }
    })
  }))
}
