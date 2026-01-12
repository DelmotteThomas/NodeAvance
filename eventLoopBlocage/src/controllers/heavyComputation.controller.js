class HeavyComputationController {
  static async blockingTask(req, res) {
    console.log(`[${process.pid}] Début de la tâche bloquante...`);
    // TODO: Initialiser le temps de départ
    let start = Date.now();
    // TODO: Créer une boucle for de 0 à 5 000 000 000  (Cette opération ne fait rien d'autre qu'incrémenter un compteur)
    let counter = 0;
    for (let i = 0; i < 5000000000; i++) {
      counter++;
    }
    // TODO: Calculer la durée totale
    let duration = Date.now() - start;

    console.log(`[${process.pid}] Tâche terminée.`);
    // TODO: Renvoyer la réponse JSON

    return res.json({
      pid: process.pid,
      duration: duration,
      message: "Tâche terminée",
    });
  }
}
module.exports = HeavyComputationController;
