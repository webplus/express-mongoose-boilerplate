const mongoose = require('mongoose')
const config = require('./index')
const logger = require('../config/winston')

module.exports = function () {
  logger.transports.console.json = false
  mongoose.set('debug', config.mongo.debug === 'true')
  mongoose.Promise = global.Promise
  mongoose.connect(config.mongo.url, { server: { socketOptions: { keepAlive: 1 } } })
  mongoose.connection.on('error', (e) => logger.error(`unable to connect to database: ${config.mongo.url}，error：${e}`))
  mongoose.connection.on('open', (e) => logger.info('Successfully opened the database lisa.'))
  mongoose.connection.on('close', (e) => logger.info('Lisa the database connection closed.'))
  mongoose.connection.on('connected', (e) => logger.info(`${config.mongo.url} The database is connected.`))
}
