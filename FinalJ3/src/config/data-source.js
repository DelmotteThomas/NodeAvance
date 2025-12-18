const { DataSource } = require('typeorm');
const User = require('../entities/User');
const Ticket = require('../entities/Ticket');
const Tag = require('../entities/Tag');

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: false,
    entities: [User, Ticket, Tag],
});

module.exports = AppDataSource;
