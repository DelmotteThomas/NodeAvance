const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../../modules/auth/auth.schema");
const validate = require("../middlewares/validate");

const {authLimiter} = require ('../middlewares/rateLimiter')

const router = express.Router();

// LOGIN
router.post(
  // Chemin URL
  "/login",
  // Limiter brute force
  authLimiter,
  // Validation des données
  validate(loginSchema),
  // Authentification avec passport
  passport.authenticate("local", { session: false }),
  // Contrôleur de connexion
  authController.login
);

// Register
router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

// Refresh Token
// router.post(
//   "/refresh",
//   authController.refresh
// );

module.exports = router;
