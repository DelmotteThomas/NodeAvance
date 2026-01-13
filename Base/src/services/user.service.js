const BaseService = require('../core/base-service');

class UserService extends BaseService {
  constructor(userRepository) {
    super(userRepository);
  }
}

module.exports = UserService;