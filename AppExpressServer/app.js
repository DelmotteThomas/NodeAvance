// app.js
require('dotenv').config();
const express = require('express');
const app = express();

// middlewares globaux
app.use(express.json());
app.use(express.static('public'));

// routes
app.use(require('./src/routes'));

module.exports = app;
