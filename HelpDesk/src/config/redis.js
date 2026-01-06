const Redis = require("ioredis"); 
// Docker injecte "redis" dans REDIS_HOST.
// Si on lance en local sans Docker, on fallback sur "localhost".
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
console.log(`Initialisation Redis vers : ${redisHost}:${redisPort}`);
// Création de l'instance de connexion 
const redis = new Redis({ host: redisHost, port: redisPort, });
// Ecouteurs pour le débogage 
redis.on('connect', () => { console.log('Redis: Connexion réussie !'); });
redis.on('error', (err) => { console.error('Redis: Erreur de connexion -', err); });

module.exports = redis;
