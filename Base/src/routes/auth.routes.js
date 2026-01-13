const express = require('express');
const passport = require('passport');

module.exports = (authController) => {
  const router = express.Router();

  // 🔐 Inscription
  router.post(
    '/register',
    authController.handleRequest('register')
  );

  // 🔐 Login (Passport Local)
  router.post(
    '/login',
    passport.authenticate('local', { session: true }),
    authController.handleRequest('login')
  );

  // 🔐 Logout
  router.post('/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Déconnecté' });
    });
  });

  // 🔐 Profil (protégé)
  router.get(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    authController.handleRequest('getProfile')
  );

  return router;
};
