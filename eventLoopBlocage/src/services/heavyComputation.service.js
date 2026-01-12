const { Worker } = require('worker_threads');
const path = require('path');

class HeavyComputationService {
  static runHeavyTask() {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.join(__dirname, '../workers/heavy.worker.js')
      );

      // Lancer le calcul
      worker.postMessage('start');

      // Résultat du worker
      worker.on('message', (result) => {
        resolve(result);
      });

      // Gestion des erreurs
      worker.on('error', (err) => {
        reject(err);
      });

      // Sécurité : worker qui meurt
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}

module.exports = HeavyComputationService;
