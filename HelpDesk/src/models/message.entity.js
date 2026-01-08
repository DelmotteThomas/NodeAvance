const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Message", 
  tableName: "messages",
  columns: {
    id: { primary: true, type: "int", generated: true },
    content: { type: "text" },
    room: { type: "varchar", default: "general" },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    sender: {
      target: "User",
      type: "many-to-one",
      joinColumn: true,
      eager: true,
    },
  },
});