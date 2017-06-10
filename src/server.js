const app = require('./config/express')
const debug = require('debug')('app:server')
const http = require('http')
const database = require('./config/database')
const config = require('./config')
const port = config.app.port
global.Promise = require('bluebird')

database()

app.set('port', port)
let server = http.createServer(app)
server.listen(port, () => console.log(`Server Start listening on port ${port}`))
server.on('error', onError)
server.on('listening', onListening)

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges')
    process.exit(1)
    // break
  case 'EADDRINUSE':
    console.error(bind + ' is already in use')
    process.exit(1)
    // break
  default:
    throw error
  }
}

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}

module.exports = server
