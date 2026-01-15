const client = require('../config/elastic');
const AppDataSource = require('../config/data-source');
const SearchService = require('../services/search.service');

async function reindex() {
  console.log(' Démarrage de la migration Elastic...');

  const searchService = new SearchService();
  await AppDataSource.initialize();

  // 1️ Supprimer l'ancien index
  try {
    await client.indices.delete({ index: 'posts' });
    console.log(' Ancien index supprimé.');
  } catch (e) {
    console.log(' Index inexistant, on continue.');
  }

  // 2️ Recréer l'index avec le nouveau mapping
  await searchService.initIndex();

  // 3️ Récupérer les données SQL
  const postRepo = AppDataSource.getRepository('Post');
  const posts = await postRepo.find();
  console.log(`📦 ${posts.length} posts récupérés depuis SQL.`);

  // 4️ Bulk reindex
  await searchService.bulkIndex(posts);

  console.log(' Migration terminée avec succès.');
  process.exit();
}

reindex().catch(console.error);
