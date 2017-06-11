const debug = require('debug')('app:auth.controller:' + process.pid)
const _ = require('lodash')
// const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
const CustError = require('../helpers/APIError')
// const config = require('../config/index')
const UserModel = require('../models/user.model')
// const tokenManager = require('../config/tokenManager')
const tokenManager = require('../config/token')

const logger = require('../config/winston')
// global.bluebird.promisifyAll(jwt)

// https://github.com/Serviox19/Passport-JWT/blob/master/routes/auth.js
// https://github.com/zanchi/jwt-express-example/blob/master/routes/auth.js

function register (req, res, next) {
  let username = req.body.username || ''
  let password = req.body.password || ''
  let passwordConfirmation = req.body.passwordConfirmation || ''
  let mobileNumber = req.body.mobileNumber || ''

  if (!username || !password || password !== passwordConfirmation) {
    return res.json({ success: false, message: 'Please enter a valid email and password to register.' })
  }
  let UserEntity = new UserModel({username: username, password: password, mobileNumber: mobileNumber})

  UserEntity.save().then(savedUser => {
    res.json({'code': 0, 'message': 'Successfully created new user.', 'data': {id: savedUser._id, username: savedUser.username}})
  }).catch(function (e) {
    logger.log('error', '写入用户到数据库失败 %j', req.body)
    // return res.json({ success: false, message: 'This user already exists!' })
    const error = new CustError.APIError(`${e.name} : ${e._message}`, httpStatus.UNAUTHORIZED)
    next(error)
  })
}

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login (req, res, next) {
  debug('Processing authenticate middleware')

  let username = req.body.username || ''
  let password = req.body.password || ''

  if (_.isEmpty(username) || _.isEmpty(password)) {
    return res.send(401)
  }

  UserModel.findOne({username: username}, function (err, user) {
    if (err) {
      const error = new CustError.APIError('Authentication error', httpStatus.UNAUTHORIZED, true)
      return next(error)
    }
    if (!user) {
      return res.json({'code': '00001', 'message': 'User not found, Try again!', 'data': {}})
    } else {
      user.comparePassword(password, function (err, isMatch) {
        if (isMatch && !err) {
          debug('User authenticated, generating token')

          let token = tokenManager.create(user, req, res, next).token

          // Create token for authenticated user expiresInMinutes: 86400 // 1 day in seconds
          // let token = jwt.sign(user, config.app.jwtSecret, { expiresIn: '1h' })
          return res.json({token: 'JWT ' + token, username: user.username})
        } else {
          res.json({'code': '00002', 'message': 'Authentication failed, passwords dont match', 'data': {}})
          console.log('Attempt failed to login with ' + user.username)
        }
      })
    }
  })
}

function logout (req, res, next) {
  if (req.user) {
    tokenManager.expire(req.headers)
    delete req.user
    return res.json({'code': '000000', 'message': 'User has been successfully logged out', 'data': {}})
  } else {
    return res.send(401)
  }
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber (req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  })
}

module.exports = {register, login, logout, getRandomNumber}
