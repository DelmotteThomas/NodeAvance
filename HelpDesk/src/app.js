// --- Dépendances ---
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');

// --- Initialisation Passport ---
require('./config/passport')(passport);

// --- Import des Routeurs ---
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

// --- Import des Middlewares ---
const logger = require('./middlewares/logger.middleware');

// --- Gestionnaire d'erreurs ---
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(logger);

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(passport.initialize()); 

// --- Définition des Routes ---
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// --- Gestionnaire d'erreurs (doit être le dernier middleware) ---
app.use(errorHandler);

module.exports = app;