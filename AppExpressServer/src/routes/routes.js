// src/routes/index.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/users', userController.getAll);
router.post('/users', userController.create);

module.exports = router;
