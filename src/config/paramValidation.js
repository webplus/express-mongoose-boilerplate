const Joi = require('Joi')

const config = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      // mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
      mobileNumber: Joi.string().regex(/^1[3|4|5|7|8]\d{9}$/).required()
    }
  },

  register: {
    body: {
      username: Joi.string().required(),
      // mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required()
      password: Joi.string().regex(/^\w{3}$/).required(),
      passwordConfirmation: Joi.string().regex(/^\w{3}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^1[3|4|5|7|8]\d{9}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
}

module.exports = config
