const express = require('express');

module.exports = (container) => {
  const router = express.Router();

  // 🔐 Authentification
  router.use(
    '/auth',
    require('./auth.routes')(container.authController)
  );

  // 👤 Utilisateurs
  router.use(
    '/users',
    require('./user.routes')(container.userController)
  );

  return router;
};
