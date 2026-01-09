import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { stringify } from 'csv-stringify';
import csv from 'csv-parser';
import ProductBatchInsertWritable from "../streams/productBatchInsertWritable.js";
import ProductValidationTransform from "../streams/productValidationTransform.js";


import AppDataSource from '../config/db.config.js';

export async function exportProducts(res) {
  const productRepository = AppDataSource.getRepository('Product');

  async function* productGenerator() {
    let lastId = 0;
    const batchSize = 1000;

    while (true) {
      console.log(`📦 Fetching batch starting after ID ${lastId}...`);

      const products = await productRepository
        .createQueryBuilder('product')
        .select([
          'product.id',
          'product.name',
          'product.price',
          'product.stock',
          'product.description',
          'product.isArchived',
        ])
        .where('product.id > :lastId', { lastId })
        .orderBy('product.id', 'ASC')
        .take(batchSize)
        .getMany();

      if (products.length === 0) break;

      for (const product of products) {
        yield product;
      }

      lastId = products[products.length - 1].id;
    }
  }

  await pipeline(
    Readable.from(productGenerator()),
    stringify({
      header: true,
      columns: ['id', 'name', 'price', 'stock', 'description', 'isArchived'],
    }),
    res
  );
}

/**
 * IMPORT CSV → DB
 * @param {Readable} inputStream (req)
 */
export async function importProducts(inputStream) {
  const validationTransform = new ProductValidationTransform();
  const batchInsertWritable = new ProductBatchInsertWritable({ batchSize: 500 });

  console.log('Démarrage du pipeline d’import');

  await pipeline(
    inputStream,          // req
    csv(),                // CSV → objets JS
    validationTransform,  // nettoyage + validation
    batchInsertWritable   // batch insert DB
  );

  console.log('Import terminé');
}