const debug = require('debug')('app:token:' + process.pid)
const redisClient = require('./redis').redisClient
const jsonwebtoken = require('jsonwebtoken')
const httpStatus = require('http-status')
const config = require('./index')
const CustError = require('../helpers/APIError')
const TOKEN_EXPIRATION = 60
const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60

/**
 * 为已登录的用户创建一个新令牌.
 *
 * @param user
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const create = function (user, req, res, next) {
  debug('Create token')

  if (!user) return next(new Error('User data cannot be empty.'))

  var data = {
    _id: user._id,
    username: user.username,
    token: jsonwebtoken.sign({ _id: user._id }, config.app.jwtSecret, { expiresIn: '1h' })
  }
  // let token = jwt.sign(user, config.app.jwtSecret, { expiresIn: '1h' })expiresInMinutes: TOKEN_EXPIRATION

  var decoded = jsonwebtoken.decode(data.token)
  data.token_exp = decoded.exp
  data.token_iat = decoded.iat

  debug('Token generated for user: %s, token: %s', data.username, data.token)

  redisClient.set(data.token, JSON.stringify(data), function (err, reply) {
    if (err) return next(new Error(err))
    if (reply) {
      redisClient.expire(data.token, TOKEN_EXPIRATION_SEC, function (err, reply) {
        if (err) {
          return next(new Error('Can not set the expire value for the token key'))
        }
        if (reply) {
          // req.user = data
          next() // we have succeeded
        } else {
          return next(new Error('Expiration not set on redis'))
        }
      })
    } else {
      return next(new Error('Token not set in redis'))
    }
  })
  return data
}

/**
 * 从Redis中检索特定的Token
 * @param id
 * @param done
 * @returns {*}
 */
const retrieve = function (id, done) {
  debug('Calling retrieve for token: %s', id)

  if (!id) {
    return done(new Error('token_invalid'), {
      'message': 'invalid token'
    })
  }

  redisClient.get(id, function (err, reply) {
    if (err) return done(err, { 'message': err })

    if (!reply) {
      return done(new Error('token_invalid'), {
        'message': '令牌不存在，您确定它没有过期或已被取消吗？'
      })
    } else {
      var data = JSON.parse(reply)
      debug('User data fetched from redis store for user: %s', data.username)

      if (data.token === id) {
        return done(null, data)
      } else {
        return done(new Error('token_doesnt_exist'), {
          'message': '令牌不存在，登录到系统中，这样它就可以生成新的令牌!'
        })
      }
    }
  })
}

/**
 * 验证请求中提供的令牌的有效性，通过检查Redis存储是否储存.
 *
 * @param req
 * @param res
 * @param next
 */
const verify = function (req, res, next) {
  debug('Verifying token')

  var token = fetch(req.headers)

  jsonwebtoken.verify(token, config.app.jwtSecret, function (err, decode) {
    if (err) {
      req.user = undefined
      const error = new CustError.UnauthorizedError({code: '0001', message: 'invalid_token', isPublic: true})
      // return res.json({'code': '0001', 'message': 'invalid_token', 'data': {}})
      return next(error)
    }

    retrieve(token, function (err, data) {
      if (err) {
        req.user = undefined
        const error = new CustError.UnauthorizedError('invalid_token', httpStatus.UNAUTHORIZED, true)
        return next(error)
      }
      req.user = data
      next()
    })
  })
}

/**
 * 从请求中的标头中查找授权标头
 * @param headers
 * @returns {*}
 */
const fetch = function (headers) {
  if (headers && headers.authorization) {
    let authorization = headers.authorization
    let part = authorization.split(' ')
    if (part.length === 2) {
      return part[1]
    } else {
      return null
    }
  } else {
    return null
  }
}

/**
 * 到期令牌，因此用户不能再次访问系统，而不必再次登录或请求新令牌.
 *
 * @param headers
 * @returns {boolean}
 */
const expire = function (headers) {
  var token = fetch(headers)

  debug('Expiring token: %s', token)

  if (token !== null) {
    redisClient.expire(token, 0)
  }

  return token !== null
}

const tokenMiddleware = function () {
  var func = function (req, res, next) {
    var token = fetch(req.headers)
    retrieve(token, function (err, data) {
      if (err) {
        req.user = undefined
        const error = new CustError.UnauthorizedError('invalid_token', httpStatus.UNAUTHORIZED, true)
        return next(error)
      } else {
        req.user = data // _.merge(req.user, data)
        next()
      }
    })
  }

  func.unless = require('express-unless')

  return func
}

module.exports = { create, retrieve, verify, fetch, expire, tokenMiddleware }
