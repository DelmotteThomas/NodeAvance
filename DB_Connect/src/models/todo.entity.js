const { EntitySchema } = require("typeorm");

// entity todo
module.exports = new EntitySchema ({
    name: 'Todo',
    tableName : 'todos',
    columns : {
        id : { primary : true, type : 'int', generated : true},
        title : { type : 'varchar'},
        completed : { type : 'boolean', default : false}
    },
    relations : {
        /* ... */
    }

});