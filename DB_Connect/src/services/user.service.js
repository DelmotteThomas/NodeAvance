const UserEntity = require('../models/user.entity');
const { ValidationError } = require('../errors/apiError');
const AppDataSource = require('../config/data_source');

class UserService{
    constructor() {
        this.userRepo = AppDataSource.getRepository(UserEntity);
    }

    async findAll() {
        return await this.userRepo.find();
    }

    async create(data) {
        if (!data.name || data.name.trim() === "") {
            throw new ValidationError("Le nom est obligatoire");
        }
        if (!data.email || data.email.trim() === "") {
            throw new ValidationError("L'email est obligatoire");
        }
        const newUser = this.userRepo.create(data);
        return await this.userRepo.save(newUser);
    }
}

const userService = new UserService();
module.exports = userService;