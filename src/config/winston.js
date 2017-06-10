const winston = require('winston')
const config = require('../config')

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'error-file',
      filename: config.app.root + '/logs/winston-error.log',
      level: 'error'
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: config.app.root + '/logs/winston-info.log',
      level: 'info'
    }),
    new (winston.transports.Console)({
      level: 'debug',
      json: true,
      colorize: true
    })
  ]
})

module.exports = logger
