const express = require('express');
const router = express.Router();

// Route légère (non bloquante)
router.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    pid: process.pid,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;