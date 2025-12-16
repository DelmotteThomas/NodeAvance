const TodoEntity = require("../models/todo.entity");
const { ValidationError, NotFoundError } = require("../errors/apiError");
const AppDataSource = require("../config/data_source");
const userService = require("./user.service");
const tagService = require("./tag.service");

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
      user: user, // 3. Assigner l'utilisateur
    });

    if (todoData.tagIds) {
      const tags = await tagService.findByIds(todoData.tagIds);
      newTodo.tags = tags;
    }
    // 4. Sauvegarder
    return await this.todoRepo.save(newTodo);
  }

  async findById(id) {
    const todo = await this.todoRepo.findOne({
      where: { id },
      relations: ["tags"],
    });

    if (!todo) {
      throw new NotFoundError("Tâche introuvable");
    }

    return todo;
  }

  async addTagToTodo(todoId, tagId) {
    const todo = await this.findById(todoId);
    const tag = await tagService.findByIds([tagId]);

    if (!todo.tags) {
        todo.tags = [];
    }

    const alreadyLinked = todo.tags.some(t => t.id === tag.id);
    if (!alreadyLinked) {
        todo.tags.push(tag);
    }

    return await this.todoRepo.save(todo);
}
}

const todoService = new TodoService();
module.exports = todoService;
