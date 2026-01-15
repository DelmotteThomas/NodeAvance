const AppDataSource = require('../config/data-source');
const Post = require('../models/post.entity');

async function seed() {
  console.log("🌱 Démarrage du Seeding SQL (PostgreSQL)...");

  await AppDataSource.initialize();

  const postRepo = AppDataSource.getRepository(Post);

  console.log("🧹 Nettoyage de la table 'posts'...");
  await postRepo.clear();

  const posts = [];
  const topics = ['Node.js', 'Elasticsearch', 'Docker', 'Redis', 'Architecture'];
  const adjectives = ['Incroyable', 'Rapide', 'Performant', 'Moderne', 'Complexe'];

  for (let i = 1; i <= 50; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

    posts.push({
      title: `${topic} ${adj} - Tutoriel #${i}`,
      content: `Dans ce tutoriel complet sur ${topic}, nous allons voir pourquoi c'est ${adj.toLowerCase()}.`,
      tags: [topic, 'Tech', 'Tutoriel'], // ARRAY → OK Postgres
      created_at: new Date(),
    });
  }

  console.log(`💾 Insertion de ${posts.length} posts...`);
  await postRepo.save(posts);

  console.log("✅ Seeding PostgreSQL terminé");
  process.exit();
}

seed().catch(console.error);
