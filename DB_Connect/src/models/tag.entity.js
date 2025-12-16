const { EntitySchema } = require("typeorm");


module.exports = new EntitySchema ({ 
    name:'Tag',
    tableName : 'tags',
    columns : {
        id : { primary : true, type : 'int', generated : true},
        label : { type : 'varchar'}
    },
    relations : {
        todos : {
            target : 'Todo',
            type : 'many-to-many',
            joinTable : true,
            inverseSide : 'tags'
        }
    }

});