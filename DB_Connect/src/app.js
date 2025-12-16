// Require coté back end
// utilisation des vriable défini dans le .env
require('dotenv').config();
// Instancié express
const express = require('express');

// on les les routes a une varibles
const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/user.routes');

// Middleware
const logger = require('./middlewares/logger.middleware');
// Import de l'errorHandler ( gestion generative des erreurs)
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