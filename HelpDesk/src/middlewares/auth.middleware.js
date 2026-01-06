const requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    status: 'error',
    message: 'Authentification requise',
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentification requise',
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        status: 'error',
        message: 'Droits insuffisants',
      });
    }

    next();
  };
};

module.exports = { requireAuth, requireRole };




// VERSION JWT
// const passport = require('passport');

// const requireAuth = passport.authenticate('jwt', { session: false });


// const requireRole = (role) => {
// return (req, res, next) => {
//         if (!req.user) {
//             return res.status(401).json({ message: 'Authentification requise' });
//         }
//         if (req.user.role !== role) {
//             return res.status(403).json({ message: 'Droits insuffisants' });
//         }
//         next();
// };
// };
//module.exports = { requireAuth, requireRole }