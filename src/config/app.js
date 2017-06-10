
// 有View和public的版本
require('dotenv').config()

const express = require('express')
// const path = require('path')
const favicon = require('serve-favicon')
// const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const expressWinston = require('express-winston')
const expressValidation = ('express-validation')
const methodOverride = require('method-override')
const compression = require('compression')
const cookieSession = require('cookie-session')
const session = require('express-session')
// const mongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
// const httpStatus = require('http-status')
const csrf = require('csurf')
const helmet = require('helmet')
const cors = require('cors')

const winstonInstance = require('./winston')
const config = require('../config')
const routes = require('../routes/index')
const APIError = require('../helpers/APIError')
const app = express()

app.disable('x-powered-by')

// Compression middleware (should be placed before express.static)
app.use(compression({
  threshold: 512
}))

app.use(cors({
  origin: ['http://localhost:3000', 'https://reboil-demo.herokuapp.com'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}))

// Logging middleware
// if (config.app.env === 'development') {
//   app.use(logger('dev'))
// } else if (config.app.env !== 'test') {
//   log = {
//     stream: {
//       write: message => winston.info(message)
//     }
//   }
//   app.use(logger(log))
// }

// view engine setup
app.set('views', config.app.root + '/views')
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
app.use(favicon(config.app.root + '/public/images/favicon.ico'))
app.use(express.static(config.app.root + '/public'))

// expose package.json to views
app.use(function (req, res, next) {
  // res.locals.pkg = pkg
  res.locals.env = config.app.env
  next()
})

app.use(bodyParser.json({limit: config.app.bodyLimit}))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(cookieSession({ secret: 'secret' }))
app.use(session({
  secret: 'DEMO',
  proxy: true,
  resave: true,
  saveUninitialized: true
  // store: new mongoStore({
  //   'url': config.mongo.url,
  //   'collection': 'sessions'
  // })
}))

// connect flash for flash messages - should be declared after sessions
app.use(flash())

// Compression middleware (should be placed before express.static)
app.use(compression({threshold: 512}))
app.use(methodOverride())

// app.use(passport.initialize())
// app.use(passport.session())

// configure passport for Auth
// passport.use(User.createStrategy())
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors({
  origin: ['http://localhost:3000', 'https://reboil-demo.herokuapp.com'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}))

// adds CSRF support
if (process.env.NODE_ENV !== 'test') {
  app.use(csrf())

  // This could be moved to view-helpers :-)
  app.use(function (req, res, next) {
    res.locals.csrf_token = req.csrfToken()
    next()
  })
}

// mount all routes on /api path
app.use('/api', routes)

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// log error in winston transports except when executing test suite
if (config.app.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }))
}

// error handlers
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
