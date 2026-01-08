const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// GET /api/messages/general 
router.get('/general', chatController.getGeneralHistory);

module.exports = router;