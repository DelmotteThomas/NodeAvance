const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const todoController = require('../controllers/todo.controller');

userRouter.get('/', userController.getAllUsers);
userRouter.post('/', userController.createUser);
userRouter.get('/pending-tasks', userController.getUsersWithPendingTasks);

// Route pour créer un todo pour un utilisateur spécifique
userRouter.post('/:userId/todos', todoController.createTodo);


module.exports = userRouter;
