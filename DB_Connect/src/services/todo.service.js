const TodoEntity = require('../models/todo.entity');
const { ValidationError, NotFoundError } = require('../errors/apiError');
const AppDataSource = require('../config/data_source');
const userService = require('./user.service');


class TodoService {
    constructor() {
        this.todoRepo = AppDataSource.getRepository(TodoEntity);
    }

    async findAll() {
        return await this.todoRepo.find();
    }

    async create(todoData, userId) {
        if (!todoData.title || todoData.title.trim() === "") {
            throw new ValidationError("Le titre est obligatoire");
        }

        // 1. Récupérer l'utilisateur
        const user = await userService.findById(userId);

        // 2. Créer la tâche
        const newTodo = this.todoRepo.create({
            ...todoData,
            user: user // 3. Assigner l'utilisateur
        });

        // 4. Sauvegarder
        return await this.todoRepo.save(newTodo);
    }
}

const todoService = new TodoService();
module.exports = todoService