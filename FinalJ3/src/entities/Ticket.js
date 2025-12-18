const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Ticket',
    tableName: 'tickets',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        title: {
            type: 'varchar',
        },
        description: {
            type: 'text',
        },
        status: {
            type: 'varchar',
            default: 'OPEN', // OPEN, IN_PROGRESS, DONE
        },
        priority: {
            type: 'varchar',
            default: 'LOW', // LOW, HIGH
        },
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: true,
            inverseSide: 'tickets',
        },
        tags: {
            target: 'Tag',
            type: 'many-to-many',
            joinTable: true,
            inverseSide: 'tickets',
        },
    },
});
