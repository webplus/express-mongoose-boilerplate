const redis = require('redis')
const logger = require('./winston')
const config = require('../config')
const redisClient = redis.createClient(config.redis.url, config.redis.opts)
// global.Promise = require('bluebird')
// global.bluebird.promisifyAll(redis.RedisClient.prototype)
// global.bluebird.promisifyAll(redis.Multi.prototype)

// redisClient.auth('config.redis.auth_pwd', function (e) {
//   logger.info('success auth')
// })

redisClient.on('error', function (err) {
  logger.error(`error event - ${redisClient.host} : ${redisClient.port} - error ${err}`)
})

redisClient.on('connect', function () {
  logger.info('Redis successfully connected')
})

exports.redis = redis
exports.redisClient = redisClient
