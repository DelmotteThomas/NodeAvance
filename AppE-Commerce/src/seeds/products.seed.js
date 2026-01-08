import AppDataSource from '../config/db.config.js';
import Product from '../models/Product.entity.js';

await AppDataSource.initialize();
const repo = AppDataSource.getRepository(Product);

const products = [];

for (let i = 0; i < 2500; i++) {
  products.push({
    name: `Produit ${i}`,
    price: (Math.random() * 100).toFixed(2),
    stock: Math.floor(Math.random() * 50),
    description: 'Description automatique',
    isArchived: false,
  });
}

await repo.save(products);
process.exit(0);
