const todoService = require('../services/todo.service');
const asyncHandler = require('../utils/asyncHandler');

const todoController = {
    getAllTodos: asyncHandler(async (req, res) => {
        const todos = await todoService.findAll();
        res.status(200).json(todos);
    }),

    createTodo: asyncHandler(async (req, res) => {
        
        const createdTodo = await todoService.create(req.body, req.params.userId);
        res.status(201).json(createdTodo);
    }),

    addTag: asyncHandler(async (req, res) => {
        const { todoId } = req.params;
        const { tagId } = req.body; 
        const updatedTodo = await todoService.addTagToTodo(todoId, tagId);
        res.status(200).json(updatedTodo);
    }),
};

module.exports = todoController;