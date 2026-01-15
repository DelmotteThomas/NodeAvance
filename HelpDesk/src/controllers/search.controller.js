const AppDataSource = require('../config/data-source');
const Post = require('../models/post.entity');


class SearchController {
  constructor(searchService) {
    this.searchService = searchService;
  }

  /**
   * POST /search/index-all
   * Récupère tous les posts SQL et les indexe dans Elastic (bulk)
   */
  indexAll = async (req, res) => {
    try {
      const postRepo = AppDataSource.getRepository(Post);
      const posts = await postRepo.find();

      console.log(`[SYNC] ${posts.length} posts récupérés depuis SQL`);
        // 2. Envoyer au service Elastic (Bulk)
      await this.searchService.bulkIndex(posts);

      res.json({
        success: true,
        message: `${posts.length} posts synchronisés vers Elasticsearch.`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur de synchronisation Elastic' });
    }
  };
}

module.exports = SearchController;
