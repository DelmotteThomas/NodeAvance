const express = require('express');
const todoRouter = express.Router();
const todoController = require('../controllers/todo.controller');

// Cette route est maintenant globale et non liée à un utilisateur
todoRouter.get('/', todoController.getAllTodos);

// La création se fait maintenant via la route des utilisateurs pour lier la tâche
// La nouvelle route sera dans user.routes.js

module.exports = todoRouter;