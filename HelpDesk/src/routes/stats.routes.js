const express = require('express');
const router = express.Router();
const cache = require('../middlewares/cache.middleware');

let fakeSalesData = {
  totalSales: 150000,
  topProduct: 'Café',
  lastUpdated: new Date(),
};
// Route avec CACHE
router.get('/', cache(60), async (req, res) => {
  // Simulation d'un calcul lourd (2 secondes)
  await new Promise(resolve => setTimeout(resolve, 2000));

  res.json({
    ...fakeSalesData,
    generatedAt: new Date().toISOString(),
  });
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
