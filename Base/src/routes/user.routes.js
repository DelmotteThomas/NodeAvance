const express = require('express');

module.exports = (userController) => {
  const router = express.Router();

  // GET /users
  router.get('/', userController.handleRequest('getAll'));

  // POST /users
  router.post('/', userController.handleRequest('create'));

  // GET /users/:id
  router.get('/:id', userController.handleRequest('getById'));

  // DELETE /users/:id
  router.delete('/:id', userController.handleRequest('delete'));

  return router;
};
