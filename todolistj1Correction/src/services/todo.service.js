const TodoModel = require('../models/todo.model');
const { ValidationError } = require('../errors/apiError');

class TodoService {
    async findAll() {
        return await TodoModel.findAll();
    }

    async create(data) {
        if (!data.title || data.title.trim() === "") {
            throw new ValidationError("Le titre est obligatoire");
        }
        return await TodoModel.create(data);
    }
}

const todoService = new TodoService();
module.exports = todoService