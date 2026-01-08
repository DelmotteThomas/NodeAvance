const session = require('express-session');
const { RedisStore } = require('connect-redis');
const redis = require('../config/redis');

const sessionMiddleware = session({
  store: new RedisStore({ client: redis }),
  secret: process.env.JWT_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
});

module.exports = sessionMiddleware;
