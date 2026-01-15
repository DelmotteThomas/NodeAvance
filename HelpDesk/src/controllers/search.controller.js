const AppDataSource = require("../config/data-source");
const Post = require("../models/post.entity");

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
      res.status(500).json({ error: "Erreur de synchronisation Elastic" });
    }
  };

  /**
   * GET /api/search?q=...
   */
  search = async (req, res) => {
    try {
      const { q, sort, page, limit } = req.query;

      // Validation basique
      if (!q || q.length < 2) {
        return res.status(400).json({
          error: 'Le paramètre de recherche "q" est trop court.',
        });
      }

      console.log(`[SEARCH] Recherche pour : "${q}"`);
      const pageNumber = Math.max(parseInt(page) || 1, 1);
      const limitNumber = Math.min(parseInt(limit) || 10, 50);
      const { total, results } = await this.searchService.searchPosts(
        q,
        pageNumber,
        sort,
        limitNumber
      );

      res.json({
        query: q,
        sort: sort || "score",
        count: results.length,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
        results,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Erreur serveur lors de la recherche",
      });
    }
  };

  /**
   * GET /api/search/suggest?q=...
   * Autocomplétion basée sur Elasticsearch (completion suggester)
   */
  suggest = async (req, res) => {
    try {
      const { q } = req.query;

      // Validation basique
      if (!q || q.length < 2) {
        return res.json([]);
      }

      console.log(`[SUGGEST] Autocomplétion pour : "${q}"`);

      const suggestions = await this.searchService.suggestTitles(q);

      res.json(suggestions);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Erreur serveur lors de la suggestion",
      });
    }
  };
}

module.exports = SearchController;
