const redisClient = require('./redis').redisClient
  const TOKEN_EXPIRATION = 60
  const TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60

const getToken = function (headers) {
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

// Middleware for token verification
exports.verifyToken = function (req, res, next) {
  let token = getToken(req.headers)

  redisClient.get(token, function (err, reply) {
    if (err) {
      console.log(err)
      return res.send(500)
    }

    if (reply) {
      res.send(401)
    } else {
      next()
    }
  })
}

exports.expireToken = function (headers) {
  var token = getToken(headers)

  if (token != null) {
    redisClient.set(token, { is_expired: true })
    redisClient.expire(token, TOKEN_EXPIRATION_SEC)
  }
}

exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION
exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC
