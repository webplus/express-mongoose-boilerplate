const express = require('express')
const validate = require('express-validation')
const paramValidation = require('../config/paramValidation')
const userCtrl = require('../controllers/user.controller')

const router = express.Router() // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create)
  // .post(function(req, res) {
  //   console.log(req.body.bbb)
  //   res.json({})
  // })

// router.route('/:userId')
//   /** GET /api/users/:userId - Get user */
//   .get(userCtrl.get)

//   /** PUT /api/users/:userId - Update user */
//   .put(validate(paramValidation.updateUser), userCtrl.update)

//   /** DELETE /api/users/:userId - Delete user */
//   .delete(userCtrl.remove);

// /** Load user when API with userId route parameter is hit */
// router.param('userId', userCtrl.load);

module.exports = router
