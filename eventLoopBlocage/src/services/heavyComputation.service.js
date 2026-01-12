const { Worker } = require('worker_threads');
const path = require('path');

class HeavyComputationService {
  static runHeavyTask(iterations = 5_000_000_000) {
    return new Promise((resolve, reject) => {
      const workerPath = path.resolve(
        __dirname,
        '../workers/heavy.worker.js'
      );

      const worker = new Worker(workerPath, {
        workerData: { iterations }
      });

      worker.on('message', (result) => {
        resolve(result);
      });

      worker.on('error', reject);

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}

module.exports = HeavyComputationService;
