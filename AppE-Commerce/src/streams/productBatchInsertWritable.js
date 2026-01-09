import { Writable } from 'stream';
import AppDataSource from '../config/db.config.js';

export default class ProductBatchInsertWritable extends Writable {
  constructor(options = {}) {
    super({ ...options, objectMode: true });

    // Taille du batch (500 ou 1000 selon le TP)
    this.batchSize = options.batchSize || 1000;

    // Buffer temporaire
    this.batch = [];

    // Repository TypeORM
    this.productRepository = AppDataSource.getRepository('Product');
  }
// Méthode pour vider le buffer 

  async _write(chunk, encoding, callback) {
    // 1 Ajouter le produit au buffer
    this.batch.push(chunk);

    // 2 Vérifier si le buffer est plein / Si oui, on le vide
    if (this.batch.length >= this.batchSize) {
      try {
        console.log(
          `Buffer plein (${this.batch.length} items). Écriture en base.`
        );

        //  Backpressure ici : on attend l'INSERT
        await this.flushBatch();

        //  On autorise la suite du flux
        callback();
      } catch (error) {
        callback(error);
      }
    } else {
      // Buffer pas plein → on continue
      callback();
    }
  }

  // Si il reste des choses dans le buffer à la fin du flux
  // ex 125/1000 données avec batchSize = 1000
  async _final(callback) {
    try {
      console.log('🏁 Fin du flux. Écriture du ou des dernier(s) élément(s)');

      // 3 Écriture des restes
      if (this.batch.length > 0) {
        await this.flushBatch();
      }

      callback();
    } catch (error) {
      callback(error);
    }
  }

  // Méthode helper
  async flushBatch() {
    if (this.batch.length === 0) return;

    // INSERT en masse (rapide)
    await this.productRepository.insert(this.batch);

    // On vide le buffer
    this.batch = [];
  }
}
