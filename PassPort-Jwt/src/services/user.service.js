const UserEntity = require('../models/user.entity');
const { ValidationError, NotFoundError } = require('../errors/apiError');
const AppDataSource = require('../config/data_source');

class UserService{
    constructor() {
        this.userRepo = AppDataSource.getRepository(UserEntity);
    }

    async findAll() {
        return await this.userRepo.find({
            relations: {
                todos: true
            }
        });
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

    async findById(id) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundError("Utilisateur non trouvé");
        }
        return user;
    }

   
}

const userService = new UserService();
module.exports = userService;