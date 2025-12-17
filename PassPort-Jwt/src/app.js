// Require coté back end
// utilisation des vriable défini dans le .env
require('dotenv').config();
// Instancié express
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');

require('./config/passport')(passport);

// on lie les routes a une varibles

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

// Middleware
const logger = require('./middlewares/logger.middleware');
// Import de l'errorHandler ( gestion generative des erreurs)
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(logger);

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(passport.initialize()); 
// Définition des Routes 


// User
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);


// Gestion des erreurs

app.use(errorHandler);

module.exports = app;