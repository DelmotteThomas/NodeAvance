const { DataSource } = require('typeorm');

const UserEntity = require('../models/user.entity');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  synchronize: true, // ⚠️ DEV UNIQUEMENT
  logging: true,

  entities: [
    UserEntity,
  ],
});

module.exports = AppDataSource;
