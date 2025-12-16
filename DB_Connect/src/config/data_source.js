const { DataSource } = require('typeorm');

const UserEntity = require('../models/user.entity');
const TodoEntity = require('../models/todo.entity');


const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true, 
  logging: true,
  entities: [
    UserEntity,
    TodoEntity
  ]

});

module.exports = AppDataSource;