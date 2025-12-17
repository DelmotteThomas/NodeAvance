const bcrypt = require('bcrypt');
const UserEntity = require('../models/user.entity');
const { ValidationError, NotFoundError } = require('../errors/apiError');
const AppDataSource = require('../config/data-source');

class UserService {
  constructor() {
    this.userRepo = AppDataSource.getRepository(UserEntity);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async create(data) {
    
    if (!data.email || data.email.trim() === '') {
      throw new ValidationError("L'email est obligatoire");
    }
    if (!data.password || data.password.trim() === '') {
      throw new ValidationError('Le mot de passe est obligatoire');
    }

    //  HASH DU MOT DE PASSE
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = this.userRepo.create({
      email: data.email,
      password: hashedPassword,
      role: data.role || 'CLIENT',
    });

    return await this.userRepo.save(newUser);
  }

  async findById(id) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }
    return user;
  }
}

const userService = new UserService();
module.exports = userService;
