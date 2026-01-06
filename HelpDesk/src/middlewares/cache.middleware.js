const redis = require('../config/redis');

/**
 * Middleware de cache Redis
 * @param {number} duration Durée du cache en secondes
 */
const cache = (duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redis.get(key);

      if (cachedData) {
        console.log(`🟢 Cache HIT → ${key}`);
        return res.json(JSON.parse(cachedData));
      }

      console.log(`🔴 Cache MISS → ${key}`);

      // Interception de la réponse
      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        await redis.set(key, JSON.stringify(body), {
          EX: duration,
        });
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Erreur cache middleware:', err);
      next();
    }
  };
};

module.exports = cache;
