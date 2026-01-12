const HeavyComputationService = require('../services/heavyComputation.service');

class HeavyComputationController {
  static async blockingTask(req, res) {
    console.log(`[${process.pid}] Début de la tâche bloquante...`);

    const start = Date.now();

    let counter = 0;
    for (let i = 0; i < 5_000_000_000; i++) {
      counter++;
    }

    const duration = Date.now() - start;

    console.log(`[${process.pid}] Tâche terminée.`);

    return res.json({
      pid: process.pid,
      duration,
      message: 'Tâche terminée',
    });
  }

  static async heavyTaskWorker(req, res) {
    console.log(`[${process.pid}] Délégation au Worker Thread`);

    try {
      const result = await HeavyComputationService.runHeavyTask();

      return res.json({
        status: 'success',
        mode: 'Délégation à un worker pour tâche lourde',
        pid: process.pid,
        ...result,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = HeavyComputationController;
