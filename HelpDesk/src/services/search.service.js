const client = require("../config/elastic");

class SearchService {
  constructor() {
    this.index = "posts";
  }

  /**
   * Initialise l'index avec le mapping s'il n'existe pas
   * sorte de table
   */
  async initIndex() {
    try {
      const exists = await client.indices.exists({ index: this.index });

      if (exists) {
        console.log(`[ELASTIC] L'index '${this.index}' existe déjà.`);
        return;
      }

      await client.indices.create({
        index: this.index,
        body: {
          mappings: {
            properties: {
              // 🔥 MULTI-FIELD
              title: {
                type: "text",
                fields: {
                  raw: { type: "keyword" }, // pour le tri
                },
              },
              content: { type: "text" },
              tags: { type: "keyword" },
              created_at: { type: "date" },

              // 🔥 AUTOCOMPLÉTION (préparation)
              suggest: { type: "completion" },
            },
          },
        },
      });

      console.log(`[ELASTIC] Index '${this.index}' créé avec succès.`);
    } catch (error) {
      console.error("[ELASTIC] Erreur initIndex :", error.message);
    }
  }

  /**
   * Indexe un tableau de documents en une seule requête HTTP.
   * @param {Array} posts - Liste des entités Post venant de SQL
   */
  async bulkIndex(posts) {
    if (!posts || posts.length === 0) return;

    try {
      //  FORMAT OFFICIEL TP
      const operations = posts.flatMap((post) => [
        {
          index: {
            _index: this.index,
            _id: post.id.toString(),
          },
        },
        {
          title: post.title,
          content: post.content,
          tags: post.tags,
          created_at: post.created_at,

          suggest: {
            input: post.title.split(" "),
          },
        },
      ]);

      const bulkResponse = await client.bulk({
        refresh: true,
        operations,
      });

      if (bulkResponse.errors) {
        console.error("[ELASTIC] Erreurs lors du Bulk");
      } else {
        console.log(`🚀 Bulk success : ${posts.length} documents indexés.`);
      }
    } catch (error) {
      console.error("[ELASTIC] Erreur critique Bulk :", error.message);
    }
  }

  /**
   * Effectue une recherche Full Text sur les articles.
   * @param {string} query - Terme recherché
   * @returns {Array}
   */
  async searchPosts(query) {
    try {
      const result = await client.search({
        index: this.index,
        body: {
          query: {
            multi_match: {
              query: query,
              fields: ["title^3", "content"], // boost titre
              fuzziness: "AUTO", // tolérance fautes
            },
          },
        },
      });

      // Nettoyage de la réponse Elastic
      return result.hits.hits.map((hit) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source,
      }));
    } catch (error) {
      console.error("❌ Erreur de recherche Elastic :", error.message);
      return [];
    }
  }
}

module.exports = SearchService;
