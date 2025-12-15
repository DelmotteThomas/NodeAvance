// controllers/user.controller.js
const userService = require('../services/user.service');

exports.getAll = async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
