require('dotenv').config();

const express = require('express');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./errors/errorHandler');
const heavyRoutes = require('./routes/heavy.routes');
const healthRoutes = require('./routes/health.routes');
const app = express();

app.use(express.json());
app.use(logger);


app.use('/api/', heavyRoutes);
app.use('/api/', healthRoutes);

app.use(errorHandler);

module.exports = app;