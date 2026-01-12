const { parentPort } = require('worker_threads');

if (!parentPort) {
  throw new Error('This file must be run as a worker');
}

parentPort.on('message', (msg) => {
  if (msg !== 'start') return;

  const start = Date.now();

  for (let i = 0; i < 5_000_000_000; i++) {}

  const duration = Date.now() - start;

  parentPort.postMessage({
    pid: process.pid,
    duration,
  });
});
