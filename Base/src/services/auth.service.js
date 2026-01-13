const bcrypt = require('bcryptjs');
const {
  ValidationError,
  ApiError,
} = require('../errors/api-error');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(username, password) {
    if (!username || !password) {
      throw new ValidationError('Username et password requis');
    }

    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new ApiError(409, 'Username déjà pris');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      username,
      password: hashedPassword,
    });

    return {
      id: user.id,
      username: user.username,
    };
  }

  async validateUser(username, password) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  }
}

module.exports = AuthService;
