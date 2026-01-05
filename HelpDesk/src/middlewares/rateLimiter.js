const rateLimit = require ('express-rate-limit');

// Limiter Global s'applique a toutes les routes

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000 , // 15min
    max : 100, // Limite chaque IP a 100 requêtes par fênetre
    message : {
        status: 429,
        error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
    },
    standardHeaders : true, // Retourne les infos de limite dans les headers 'RateLimit'
    legacyHeaders : false, // Désactive les header 'X-RateLimit'

});

// Limiteur Stict ( Protection brute force)
// Appliquer uniquement sur les routes sensibles 

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000 , // 1heures  60 * 60 min * 1000 milli seconde
    max : 10, // Limite chaque IP a 10 tentative par heure
    message : {
        status: 429,
        error: 'Trop de tentatives de connexion depuis cette IP, veuillez réessayer plus tard.'
    }
});

module.exports = { globalLimiter, authLimiter};