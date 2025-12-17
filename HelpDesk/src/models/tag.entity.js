const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Tag", // Nom de l'entité (utilisé dans getRepository)
  tableName: "tags", // Nom réel de la table en SQL
  columns: {
    id: { primary: true, type: "int", generated: true },
    label: { type: "varchar" },
    
  },
  relations: {
    tickets: {
      target: "Ticket",
      type: "many-to-many",
      inverseSide: "tags",
    },
  },
});
