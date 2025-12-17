const express = require('express');
const userController = require('../controllers/user.controller');

const { requireRole, requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Route protégée
router.get(
  '/',
  requireAuth, 
  userController.getAllUsers
);

router.get('/profile', requireAuth, (req, res) => {
  res.json(req.user);
});

router.get('/admin-dashboard', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: "Bienvenue dans la zone d'administration" });
});

module.exports = router;
