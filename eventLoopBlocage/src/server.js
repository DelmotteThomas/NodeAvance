const cluster = require('cluster');
const os = require('os');

const PORT = process.env.PORT || 3000;
const WORKERS = Math.min(os.cpus().length,8); // limite 8 worker

if (cluster.isPrimary) {
  console.log(`🧠 Master ${process.pid} lancé`);
  console.log(`⚙️ ${WORKERS} workers`);

  for (let i = 0; i < WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`❌ Worker ${worker.process.pid} mort`);
    cluster.fork();
  });

} else {
  const app = require('./app');

  app.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} écoute sur http://localhost:${PORT}`);
  });
}
