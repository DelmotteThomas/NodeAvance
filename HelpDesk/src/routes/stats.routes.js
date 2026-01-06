const express = require('express');
const router = express.Router();
const cache = require('../middlewares/cache.middleware');

let fakeSalesData = {
  totalSales: 150000,
  topProduct: 'Café',
  lastUpdated: new Date(),
};
// Route avec CACHE
router.get('/stats', cache(60), async (req, res) => {
  // Simulation d'un calcul lourd (2 secondes)
  await new Promise(resolve => setTimeout(resolve, 2000));

  res.json({
    ...fakeSalesData,
    generatedAt: new Date().toISOString(),
  });
});

router.post('/sales', async (req, res) => {
  fakeSalesData.totalSales += 100;
  fakeSalesData.lastUpdated = new Date();

  await redis.del('cache:/api/stats');

  res.json({ message: 'Vente ajoutée, cache invalidé' });
});

// Route sans CACHE
// router.get('/', async (req, res) => {
//   // Simulation d'un calcul lourd (2 secondes)
//   await new Promise(resolve => setTimeout(resolve, 2000));

//   res.json({
//     ...fakeSalesData,
//     generatedAt: new Date().toISOString(),
//   });
// });

module.exports = router;
