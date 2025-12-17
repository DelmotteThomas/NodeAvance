const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Ticket", // Nom de l'entité (utilisé dans getRepository)
  tableName: "tickets", // Nom réel de la table en SQL
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar", unique: true },
    description: { type: "varchar" },
    status: { type: "varchar", default: "OPEN" },
    priority: { type: "varchar", default: "LOW" },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      inverseSide: "tickets",
    },
    tags: {
      target: "Tag",
      type: "many-to-many",
      joinTable: true,
      inverseSide: "tickets",
    },
  },
});
