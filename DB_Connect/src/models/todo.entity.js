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
        user : {
            target : 'User',
            type : 'many-to-one',
            // Creation d'un colonne dans la Table de destination icic todo pour injecter la Fk. /  ou la contrainte
            joinColumn : true, 
            inverseSide : 'todos'
        },
        tags : {
            target : 'Tag',
            type : 'many-to-many',
            joinTable : true,
            inverseSide : 'todos'
        }
    }

});