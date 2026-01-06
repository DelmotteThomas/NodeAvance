const { createClient } = require('redis');

const redis = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
});

redis.on('connect', () => {
  console.log('Redis: Connexion réussie !');
});

redis.on('error', (err) => {
  console.error('Redis error', err);
});

redis.connect();

module.exports = redis;
