import AppDataSource from '../config/db.config.js';
import ProductBatchInsertWritable from '../streams/productBatchInsertWritable.js';

async function testWritable() {
  // 1 Initialiser la DB (obligatoire)
  await AppDataSource.initialize();
  console.log('DB connectée pour le test du Writable');

  // 2 Créer le Writable avec un PETIT batch pour tester
  const writer = new ProductBatchInsertWritable({ batchSize: 3 });

  // 3 Envoyer des objets "fake"
  writer.write({
    name: 'Produit A',
    price: 1.1,
    stock: 10,
    description: 'Test A',
    isArchived: false,
  });

  writer.write({
    name: 'Produit B',
    price: 2.2,
    stock: 20,
    description: 'Test B',
    isArchived: false,
  });

  writer.write({
    name: 'Produit C',
    price: 3.3,
    stock: 30,
    description: 'Test C',
    isArchived: false,
  }); // ICI le batch est plein (3 items) → INSERT

  writer.write({
    name: 'Produit D',
    price: 4.4,
    stock: 40,
    description: 'Test D',
    isArchived: false,
  });
    writer.write({
    name: 'Produit E',
    price: 5.5,
    stock: 50,
    description: 'Test E',
    isArchived: false,
  });

  writer.write({
    name: 'Produit F',
    price: 6.6,
    stock: 60,
    description: 'Test F',
    isArchived: false,
  }); // ICI le batch est plein (3 items) → INSERT

  writer.write({
    name: 'Produit G',
    price: 7.7,
    stock: 70,
    description: 'Test G',
    isArchived: false,
  });

  // 4 Fin du flux → _final() appelé pour vider le buffer des objet restants
  writer.end();
}

testWritable().catch(console.error);
