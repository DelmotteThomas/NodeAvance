const { UnauthorizedError, ApiError } = require('../errors/api-error');

/**
 * Middleware pour vérifier si l'utilisateur est authentifié via Passport/Session.
 * Fonctionne avec Redis car Passport récupère l'user via le sessionID stocké dans Redis.
 */
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  next(
    new UnauthorizedError(
      'Authentification requise. Veuillez vous connecter.'
    )
  );
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur.
 * @param {string} role - Le rôle requis (ex: 'SUPPORT', 'ADMIN')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new UnauthorizedError('Authentification requise')
      );
    }

    if (req.user.role !== role) {
      return next(
        new ApiError(
          403,
          `Droits insuffisants. Rôle ${role} requis.`
        )
      );
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
