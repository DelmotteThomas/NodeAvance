const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Ticket", // Nom de l'entité (utilisé dans getRepository)
  tableName: "tickets", // Nom réel de la table en SQL
  columns: {
    id: { primary: true, type: "int", generated: true },
    label: { type: "varchar" },
    
  },
  relations: {
    tickets: {
      target: "Tag",
      type: "many-to-many",
      inverseSide: "tags",
    },
  },
});
