const { parentPort, workerData } = require('worker_threads');

// Fonction de calcul CPU lourd
function heavyComputation(iterations) {
  let counter = 0;

  for (let i = 0; i < iterations; i++) {
    counter++;
  }

  // On retourne le nombre d'itérations effectuées
  return counter;
}

// Vérification de sécurité : uniquement exécuté en Worker Thread
if (!parentPort) {
  throw new Error('This file must be run as a worker');
}

// Récupération des données envoyées par le thread principal
const iterations = workerData?.iterations || 5_000_000_000;

// Exécution du calcul dans ce thread isolé
const start = Date.now();
const result = heavyComputation(iterations);
const duration = Date.now() - start;

// Envoi du résultat au thread principal
parentPort.postMessage({
  pid: process.pid,
  iterations: result,
  duration,
});
