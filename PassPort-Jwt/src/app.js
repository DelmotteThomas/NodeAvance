// Require coté back end
// utilisation des vriable défini dans le .env
require('dotenv').config();
// Instancié express
const express = require('express');

const passport = require('passport');
require('../../PassPort-Jwt/src/config/passport')(passport);

// on les les routes a une varibles

const userRoutes = require('./routes/user.routes');

// Middleware
const logger = require('./middlewares/logger.middleware');
// Import de l'errorHandler ( gestion generative des erreurs)
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(express.json());
app.use(logger);
app.use(passport.initialize()); 
// Définition des Routes 


// User
app.use('/api/users', userRoutes);


// Gestion des erreurs

app.use(errorHandler);
console.log('APP START');

module.exports = app;