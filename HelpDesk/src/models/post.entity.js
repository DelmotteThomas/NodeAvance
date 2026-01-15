const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Post",          // utilisé par getRepository("Post")
  tableName: "posts",    // table SQL réelle

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    title: {
      type: "text",
    },

    content: {
      type: "text",
    },

    /**
     * PostgreSQL ARRAY
     * Ex: ['Docker', 'Tech', 'Tutoriel']
     */
    tags: {
      type: "text",
      array: true,
    },

    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
});
