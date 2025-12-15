import { seedUsers } from '../seeds/users.seed.js';

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
}
