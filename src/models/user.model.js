const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const CustError = require('../helpers/APIError')

const UserSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    match: [/^1[3|4|5|7|8]\d{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

// Save user's hashed password
UserSchema.pre('save', function (next) {
  let user = this
  if (user.isModified('password') || this.isNew) {
    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err)

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
        // override the cleartext password with the hashed one
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

UserSchema.method({
  comparePassword (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) {
        return cb(err)
      }
      cb(null, isMatch)
    })
  }
})

UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get (id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user
        }
        const err = new CustError.APIError('No such user exists!', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      })
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list ({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({createdAt: -1})
      .skip(+skip)
      .limit(+limit).select('username')
      .exec()
  }
}

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema)
