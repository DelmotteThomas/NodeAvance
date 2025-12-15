import UserModel from "../models/user.model.js";

class UserService {
  constructor() {
    this.userModel = new UserModel();
  }

  async getAll() {
    return await this.userModel.findAll();
  }

  

  async create(data) {
    if (!data.name || !data.email) {
      const err = new Error("Invalid user data");
      err.status = 400;
      throw err;
    }

    return await this.userModel.create(data);
  }
  async delete(id) {
    const deletedUser = await this.userModel.deleteById(id);

    if (!deletedUser) {
      throw new NotFoundError('User not found');
    }

    return deletedUser;
  }
}

export default new UserService();
