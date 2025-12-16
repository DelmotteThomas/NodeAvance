const TodoEntity = require('../models/todo.entity');
const { ValidationError } = require('../errors/apiError');
const AppDataSource = require('../config/data_source');



class TodoService {
    constructor() {
        this.todoRepo = AppDataSource.getRepository(TodoEntity);
    }

    async findAll() {
        return await this.todoRepo.find();
    }

    async create(data) {
        if (!data.title || data.title.trim() === "") {
            throw new ValidationError("Le titre est obligatoire");
        }
        
        const newTodo = this.todoRepo.create(data);
        return await this.todoRepo.save(newTodo);
    }
}

const todoService = new TodoService();
module.exports = todoService