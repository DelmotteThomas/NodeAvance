import UserModel from "../models/user.model.js";

class UserService {
  constructor() {
    this.userModel = new UserModel();
  }

  async getAll() {
    return this.userModel.findAll();
  }

  async create(data) {
    if (!data.name || !data.email) {
      const err = new Error("Invalid user data");
      err.status = 400;
      throw err;
    }

    return this.userModel.create(data);
  }
}

export default new UserService();
