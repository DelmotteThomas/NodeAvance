// Sample entity

const { EntitySchema } = require("typeorm");


module.exports = new EntitySchema({
  name: "User", // Nom de l'entité (utilisé dans getRepository)
  tableName: "users", // Nom réel de la table en SQL
  columns: {
    id: { primary: true, type: "int", generated: true },
    name: { type: "varchar" },
    email: { type: "varchar", unique: true },
    isActive: { type: "boolean", default: true },
    createdAt: { createDate: true, type: "datetime" },
    updatedAt: { updateDate: true, type: "datetime" },
  },
  relations: {
    /* ... */
  },
});
