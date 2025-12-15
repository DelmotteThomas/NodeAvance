// services/user.service.js
const User = require('../models/user.model');

exports.getAll = async () => {
  return User.findAll();
};
