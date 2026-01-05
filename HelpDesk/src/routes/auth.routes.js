const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../../modules/auth/auth.schema");
const validate = require("../middlewares/validate");

const router = express.Router();

// LOGIN
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  validate(loginSchema),
  authController.login
);

// Register
router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

// Refresh Token
router.post(
  "/refresh",
  authController.refresh
);

module.exports = router;
