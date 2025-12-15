// models/user.model.js
const users = [];

exports.findAll = async () => users;

exports.create = async (data) => {
  users.push(data);
  return data;
};
