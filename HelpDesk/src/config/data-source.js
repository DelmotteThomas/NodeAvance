const { DataSource } = require('typeorm');

const UserEntity = require('../models/user.entity');
const TicketEntity = require('../models/ticket.entity');
const TagEntity = require('../models/tag.entity');



const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  synchronize: true, 
  logging: true,
  entities: [
    UserEntity,
    TagEntity,
    TicketEntity
  ]

});

module.exports = AppDataSource;