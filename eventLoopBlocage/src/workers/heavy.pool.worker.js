function heavyComputation({ iterations }) {
  let counter = 0;

  for (let i = 0; i < iterations; i++) {
    counter++;
  }

  return {
    pid: process.pid,
    iterations: counter
  };
}

module.exports = heavyComputation;
