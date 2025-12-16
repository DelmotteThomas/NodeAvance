const todoService = require('../services/todo.service');
const asyncHandler = require('../utils/asyncHandler');

const todoController = {
    getAllTodos: asyncHandler(async (req, res) => {
        const todos = await todoService.findAll();
        res.status(200).json(todos);
    }),

    createTodo: asyncHandler(async (req, res) => {
        const createdTodo = await todoService.create(req.body);
        res.status(201).json(createdTodo);
    })
};

module.exports = todoController;