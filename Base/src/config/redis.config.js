const { createClient } = require('redis');

module.exports = function createRedisClient() {
  const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

  client.on('connect', () => {
    console.log('Redis connected');
  });

  client.on('error', console.error);

  return client;
};
