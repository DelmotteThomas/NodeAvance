const session = require('express-session');
const { RedisStore } = require('connect-redis');

/**
 * Middleware de session avec Redis
 * @param {object} redisClient Client Redis injecté
 */
const createSessionMiddleware = (redisClient) => {
  return session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.JWT_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true en prod avec HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  });
};

module.exports = createSessionMiddleware;
