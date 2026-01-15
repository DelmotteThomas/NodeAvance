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
          settings: {
            analysis: {
              analyzer: {
                french_analyzer: {
                  type: "french",
                },
              },
            },
          },
          mappings: {
            properties: {
              //  MULTI-FIELD
              title: {
                type: "text",
                fields: {
                  raw: { type: "keyword" }, // pour le tri
                },
              },
              content: { type: "text" },
              tags: { type: "keyword" },
              created_at: { type: "date" },

              //  AUTOCOMPLÉTION (préparation)
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

  async searchPosts(query, page = 1, sort = "score", limit = 10) {
    try {
      const sortOptions = {
        score: [{ _score: "desc" }],
        title: [{ "title.raw": "asc" }],
        date: [{ created_at: "desc" }],
      };

      const from = (page - 1) * limit;

      const result = await client.search({
        index: this.index,
        body: {
          from, // 🔹 pagination
          size: limit, // 🔹 limite
          query: {
            multi_match: {
              query,
              fields: ["title^3", "content"],
              fuzziness: "AUTO",
            },
          },
          sort: sortOptions[sort] || sortOptions.score,

          highlight: {
            pre_tags: ["<mark>"],
            post_tags: ["</mark>"],
            fields: {
              title: {},
              content: {},
            },
          },
        },
      });

      return {
        total: result.hits.total.value,
        results: result.hits.hits.map((hit) => ({
          id: hit._id,
          score: hit._score,
          ...hit._source,

          highlight: hit.highlight || {},
        })),
      };
    } catch (error) {
      console.error("❌ Erreur searchPosts :", error.message);
      return { total: 0, results: [] };
    }
  }

  /**
   * Autocomplétion des titres (completion suggester)
   * @param {string} prefix
   */
  async suggestTitles(prefix) {
    try {
      const result = await client.search({
        index: this.index,
        body: {
          suggest: {
            post_suggest: {
              prefix,
              completion: {
                field: "suggest",
                size: 5,
              },
            },
          },
        },
      });

      return result.suggest.post_suggest[0].options.map((opt) => ({
        text: opt.text,
        score: opt._score,
      }));
    } catch (error) {
      console.error("❌ Erreur suggestTitles :", error.message);
      return [];
    }
  }
}

module.exports = SearchService;
