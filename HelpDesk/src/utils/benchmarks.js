const autocannon = require('autocannon');

(async () => {
  console.log('🚀 Benchmark GET /api/stats');

  const result = await autocannon({
    url: 'http://localhost:3000/api/stats',
    connections: 10,
    duration: 10,
  });

  console.log('\n📊 RÉSULTATS');
  console.log('-----------------------------');
  console.log(`Requêtes totales : ${result.requests.total}`);
  console.log(`Latence moyenne : ${result.latency.average} ms`);
  console.log(`Req/sec : ${result.requests.average}`);

  if (result.latency.average < 50) {
    console.log('✅ Cache ACTIF');
  } else {
    console.log('❌ Cache INACTIF');
  }
})();
