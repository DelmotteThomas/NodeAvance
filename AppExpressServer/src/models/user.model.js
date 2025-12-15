import { seedUsers } from "../seeds/users.seed.js";

export default class UserModel {
  constructor() {
    this.users = this.users = seedUsers();
    this.nextId = 3;
  }

  async findAll() {
    return this.users;
  }

  async create(data) {
    const user = {
      id: this.nextId++,
      name: data.name,
      email: data.email,
    };

    this.users.push(user);
    return user;
  }
  async findById(id) {
    return this.users.find((user) => user.id === Number(id));
  }

  async deleteById(id) {
    const index = this.users.findIndex((user) => user.id === Number(id));

    if (index === -1) {
      return null;
    }

    const deleted = this.users[index];
    this.users.splice(index, 1);
    return deleted;
  }
}
