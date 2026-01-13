/**
 * Middleware de cache Redis
 * @param {object} redisClient Client Redis injecté
 * @param {number} duration Durée du cache en secondes
 */
const cache = (redisClient, duration) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        await redisClient.set(key, JSON.stringify(body), {
          EX: duration,
        });
        return originalJson(body);
      };

      next();
    } catch (err) {
      // En cas d'erreur Redis, on ne bloque PAS la requête
      next();
    }
  };
};

module.exports = cache;
