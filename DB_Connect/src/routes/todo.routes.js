const express = require('express');
const todoRouter = express.Router();
const todoController = require('../controllers/todo.controller');

todoRouter.get('/', todoController.getAllTodos);
todoRouter.post('/', todoController.createTodo);

module.exports = todoRouter;