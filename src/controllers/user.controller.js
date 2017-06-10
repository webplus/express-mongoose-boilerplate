const UserModel = require('../models/user.model')
const logger = require('../config/winston')

module.exports = {
  get,
  create,
  list
}

/**
 * Get user
 * @returns {User}
 */
function get (req, res) {
  return res.json(req.user)
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create (req, res, next) {
  logger.log('debug', '添加用户 %j', req.body, {})
  const userEntity = new UserModel({
    username: req.body.username,
    mobileNumber: req.body.mobileNumber
  })
  logger.log('info', '写入用户到数据库 %j', req.body)
  userEntity.save().then(savedUser => {
    res.json({'code': 0, 'message': 'ok', 'data': {id: savedUser._id, username: savedUser.username}})
  }).catch(function (e) {
    logger.log('error', '写入用户到数据库失败 %j', req.body)
    next(e)
  })
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list (req, res, next) {
  const { limit = 50, skip = 0 } = req.query
  UserModel.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e))
}
