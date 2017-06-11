

## Node Express Mongoose boilerplate
A boilerplate application for building web apps using express, mongoose and passport.


## Usage
$ git clone https://github.com/madhums/node-express-mongoose.git
$ cd node-express-mongoose
$ npm install
$ cp .env.example .env
$ npm start

## Frameworks

+ Node 7 + ES6 (Babel)
+ Express
+ Passport
+ Mongoose
+ Joi

## Features:

[Express.js](https://expressjs.com.cn) as the web framework.
ES2017+ support with [Babel](https://babeljs.io/).
Automatic polyfill requires based on environment with [babel-preset-env](https://github.com/babel/babel-preset-env).
Linting with [ESLint](http://eslint.org/).
Testing with [Jest](https://facebook.github.io/jest/).

## 日志
logger.log('debug', '添加用户')
logger.log('verbose', "127.0.0.1 - there's no place like home");
logger.log('info', "127.0.0.1 - there's no place like home");
logger.log('warn', "127.0.0.1 - there's no place like home");
logger.log('error', "127.0.0.1 - there's no place like home");
logger.info('request to %j', req.body)
logger.warn("127.0.0.1 - there's no place like home");
logger.error("127.0.0.1 - there's no place like home");

## 参考
[Redis+JWT](https://github.com/kdelemme/blogjs/tree/master/api/config)

[express-babel](https://github.com/vmasto/express-babel)

[node-express-mongoose-demo](https://github.com/madhums/node-express-mongoose-demo)

[express-mongoose-es6-rest-api](https://github.com/KunalKapadia/express-mongoose-es6-rest-api)

[express-es6-rest-api](https://github.com/developit/express-es6-rest-api)

[mongoosejs docs](http://mongoosejs.com/docs/queries.html)

https://github.com/crocodilejs/crocodile-node-mvc-framework/blob/development/package.json

REST JWT DEMO

https://github.com/ilijamt/express-jwt-auth-mongoose/

https://ericswann.wordpress.com/2015/04/24/nozus-js-1-intro-to-sails-with-passport-and-jwt-json-web-token-auth/
https://matoski.com/article/jwt-express-node-mongoose/#utils

### 测试
[jest babel](https://github.com/vmasto/express-babel)
https://github.com/KunalKapadia/express-mongoose-es6-rest-api/blob/develop/server/tests/auth.test.js

### passport与JWT的关系
passport验证，JWT是规范
http://www.cnblogs.com/xiekeli/p/5607107.html

### redis
http://www.cnblogs.com/zhongweiv/p/node_redis.html
