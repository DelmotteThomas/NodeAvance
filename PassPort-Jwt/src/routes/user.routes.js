const express = require('express');
const userController = require('../controllers/user.controller');

const { requireRole, requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Route protégée
router.get(
  '/',
  requireAuth, // On utilise notre middleware pour la cohérence
  userController.getAllUsers
);

// 1. Route Profil (Tout le monde connecté)
// Le middleware requireAuth va remplir req.user
router.get('/profile', requireAuth, (req, res) => {
  res.json(req.user);
});

// 2. Route Admin (Seulement les Boss)
// On enchaîne : D'abord on vérifie l'identité, PUIS le rôle
router.get('/admin-dashboard', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: "Bienvenue dans la zone d'administration" });
});

module.exports = router;
