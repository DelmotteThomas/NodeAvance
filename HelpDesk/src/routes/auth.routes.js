const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// LOGIN
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  authController.login
);

// Register 
router.post('/register', authController.register);

// Refresh Token
router.post('/refresh', authController.refresh);


module.exports = router;
