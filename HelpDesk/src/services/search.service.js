const client = require('../config/elastic');

class SearchService {
  constructor() {
    this.index = 'posts';
  }

  /**
   * Initialise l'index avec le mapping s'il n'existe pas
   * sorte de table
   */
  async initIndex() {
    try {
      const exists = await client.indices.exists({
        index: this.index,
      });

      if (exists) {
        console.log(`[ELASTIC] Index '${this.index}' existe déjà`);
        return;
      }

      await client.indices.create({
        index: this.index,
        body: {
          mappings: {
            properties: {
              title: { type: 'text' },
              content: { type: 'text' },
              tags: { type: 'keyword' },
              created_at: { type: 'date' },
            },
          },
        },
      });

      console.log(`[ELASTIC] Index '${this.index}' créé avec succès`);
    } catch (error) {
      console.error(
        "[ELASTIC] Erreur lors de l'initialisation de l'index :",
        error.message
      );
    }
  }

  /**
   * Indexe un tableau de documents en une seule requête HTTP.
   * @param {Array} posts - Liste des entités Post venant de SQL
   */
  async bulkIndex(posts) {
    if (!posts || posts.length === 0) return;

    try {
      // ✅ FORMAT OFFICIEL TP
      const operations = posts.flatMap(post => [
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
        },
      ]);

      const bulkResponse = await client.bulk({
        refresh: true,
        operations,
      });

      if (bulkResponse.errors) {
        console.error('[ELASTIC] Erreurs lors du Bulk');
      } else {
        console.log(
          `🚀 Bulk success : ${posts.length} documents indexés.`
        );
      }
    } catch (error) {
      console.error(
        '[ELASTIC] Erreur critique Bulk :',
        error.message
      );
    }
  }
}

module.exports = SearchService;
