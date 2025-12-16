require('dotenv').config();

const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/user.routes');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(express.json());
app.use(logger);

// Définition des Routes 

// TODO
app.use('/api/todos', todoRoutes);
// User
app.use('/api/users', userRoutes);






// Gestion des erreurs

app.use(errorHandler);

module.exports = app;