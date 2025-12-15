export default class UserModel {
  constructor() {
    this.users = [];
  }

  async findAll() {
    return this.users;
  }

  async create(user) {
    this.users.push(user);
    return user;
  }
}
