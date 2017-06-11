const express = require('express')
const passport = require('passport')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const expressWinston = require('express-winston')
const expressValidation = require('express-validation')
const methodOverride = require('method-override')
const compression = require('compression')
const cookieSession = require('cookie-session')
const httpStatus = require('http-status')
// const csrf = require('csurf')
const helmet = require('helmet')
const cors = require('cors')

const winstonInstance = require('./winston')
const config = require('../config')
const routes = require('../routes/index.route')
const CustError = require('../helpers/APIError')
const app = express()

app.disable('x-powered-by')

// Logging middleware
if (config.app.env === 'development') {
  app.use(logger('dev'))
}

// view engine setup
// app.set('views', config.app.root + '/views')
// app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(config.app.root + '/public/images/favicon.ico'))
// app.use(express.static(config.app.root + '/public'))

app.use(bodyParser.json({limit: config.app.bodyLimit}))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(cookieSession({ secret: 'secret' }))
// Compression middleware (should be placed before express.static)
app.use(compression({threshold: 512}))
app.use(methodOverride())

app.use(passport.initialize())
require('./passport')(passport)

// app.use(passport.initialize())
// app.use(passport.session())
// configure passport for Auth
// passport.use(User.createStrategy())
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// enable detailed API logging in dev env
if (config.app.env === 'development') {
  expressWinston.requestWhitelist.push('body')
  expressWinston.responseWhitelist.push('body')
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}} ms',
    colorStatus: true,
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false }
  }))
}

// mount all routes on /api path
app.use('/api', routes)

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  // console.log('errooo13')
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ')
    const error = new CustError.APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof CustError.APIError || err instanceof CustError.UnauthorizedError)) {
    const apiError = new CustError.APIError('9001', err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new CustError.APIError('API not found', httpStatus.NOT_FOUND)
  return next(err)
})

// log error in winston transports except when executing test suite
if (config.app.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }))
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(err.status).json({
    // eslint-disable-line no-unused-vars
    code: err.status,
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.app.env === 'development' ? err.stack : {}
  })
})

module.exports = app
