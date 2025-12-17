const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/user.service");


const authController = {
  login: asyncHandler(async (req, res) => {
    const user = req.user; // fourni par passport local
    const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  }),
  // REGISTER
  register: asyncHandler(async (req, res) => {
    // crée l'utilisateur (hash inclus dans le service)
    const newUser = await userService.create(req.body);

    // génère un token directement après inscription
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  }),

};

module.exports = authController;