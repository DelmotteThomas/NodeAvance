const { DataSource } = require('typeorm');

// const UserEntity = require('../models/user.entity');
// const TicketEntity = require('../models/ticket.entity');
// const TagEntity = require('../models/tag.entity');
// const MessageEntity = require('../models/message.entity');
// const PostEntity = require('../models/post.entity');


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
    TagEntity,
    TicketEntity,
    MessageEntity,
    PostEntity
    
  ],
});

module.exports = AppDataSource;
