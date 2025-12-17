const { DataSource } = require('typeorm');

const UserEntity = require('../models/user.entity');


const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  synchronize: true, 
  logging: true,
  entities: [
    UserEntity,
  ]

});

module.exports = AppDataSource;