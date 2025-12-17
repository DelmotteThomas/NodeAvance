const express = require('express');
const passport = require('passport');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Route protégée
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  userController.getAllUsers
);



module.exports = router;
