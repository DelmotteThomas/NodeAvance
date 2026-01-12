const Piscina = require('piscina');
const path = require('path');

const pool = new Piscina({
  filename: path.resolve(__dirname, '../workers/heavy.pool.worker.js'),
  maxThreads: 4
});

class HeavyComputationPoolService {
  static runHeavyTask(iterations = 5_000_000_000) {
    return pool.run({ iterations });
  }
}

module.exports = HeavyComputationPoolService;
