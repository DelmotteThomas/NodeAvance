/**
 * Middleware pour vérifier si l'utilisateur est authentifié via Passport/Session.
 * Fonctionne avec Redis car Passport récupère l'user via le sessionID stocké dans Redis.
 */
const requireAuth = (req, res, next) => {
  // Vérifie si Passport a validé la session (via le cookie connect.sid)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    status: 'error',
    message: 'Authentification requise. Veuillez vous connecter.',
  });
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur.
 * @param {string} role - Le rôle requis (ex: 'SUPPORT', 'ADMIN')
 */
const requireRole = (role) => {
  return (req, res, next) => {
    // 1. On vérifie d'abord si l'utilisateur est connecté (req.user existe)
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentification requise',
      });
    }

    // 2. Vérification du rôle stocké dans l'objet utilisateur (issu de Redis)
    if (req.user.role !== role) {
      return res.status(403).json({
        status: 'error',
        message: `Droits insuffisants. Rôle ${role} requis.`,
      });
    }

    next();
  };
};

module.exports = { requireAuth, requireRole };