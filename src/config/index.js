require('dotenv').config()

const env = process.env.NODE_ENV || 'development'
const path = require('path')

console.log(env)

const config = {
  test: {
    app: {
      env: env,
      jwtSecret: process.env.JWT_SECRET,
      root: path.join(__dirname, '/../..'),
      bodyLimit: '100k',
      port: process.env.PORT || 3001,
      name: 'Koa React Gulp Mongoose Mocha'
    },
    mongo: {
      debug: process.env.DB_DEBUG,
      url: 'mongodb://localhost:27017/lisa'
    },
    redis: {
      authPassword: '123321',
      options: {},
      url: 'redis://127.0.0.1:6379/1'
    }
  },
  development: {
    app: {
      env: env,
      jwtSecret: process.env.JWT_SECRET,
      root: path.join(__dirname, '/../..'),
      bodyLimit: '100k',
      port: process.env.PORT || 3001,
      name: 'Koa React Gulp Mongoose Mocha'
    },
    mongo: {
      debug: process.env.DB_DEBUG,
      url: 'mongodb://localhost:27017/lisa'
    },
    redis: {
      authPassword: '123321',
      options: {},
      url: 'redis://127.0.0.1:6379/1'
    }
  },
  production: {
    app: {
      env: env,
      jwtSecret: process.env.JWT_SECRET,
      root: path.join(__dirname, '/../..'),
      bodyLimit: '100k',
      port: process.env.PORT || 3001,
      name: 'Koa React Gulp Mongoose Mocha'
    },
    mongo: {
      debug: process.env.DB_DEBUG,
      url: 'mongodb://lisa:iffe2017@localhost:28088/lisa'
    },
    redis: {
      authPassword: '123321',
      options: {},
      url: 'redis://:user:password@10.0.50.11:6379/db-number'
    }
  }
}
module.exports = config[env]
