import fs from 'fs';
import csv from 'csv-parser';
import { pipeline } from 'stream/promises';

import ProductValidationTransform from '../streams/productValidationTransform.js';

async function test() {
  await pipeline(
    fs.createReadStream('src/csv/test-products.csv'),
    csv(), // parse CSV → objets JS
    new ProductValidationTransform(),
    async function* (source) {
      for await (const product of source) {
        console.log('PRODUIT VALIDE :', product);
      }
    }
  );
}

test().catch(console.error);
