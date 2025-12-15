import UserModel from '../models/user.model.js';

class UserService {
  constructor() {
    this.userModel = new UserModel();
  }

  async getAll() {
    return this.userModel.findAll();
  }

  async create(data) {
    if (!data.name) {
      const err = new Error('Le nom est requis');
      err.status = 400;
      throw err;
    }

    return this.userModel.create(data);
  }
}

export default new UserService();
