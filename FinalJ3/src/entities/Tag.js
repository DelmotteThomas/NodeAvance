const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Tag',
    tableName: 'tags',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        label: {
            type: 'varchar',
            unique: true,
        },
    },
    relations: {
        tickets: {
            target: 'Ticket',
            type: 'many-to-many',
            inverseSide: 'tags',
        },
    },
});
