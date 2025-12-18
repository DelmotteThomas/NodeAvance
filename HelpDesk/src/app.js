// --- Dépendances ---
require('dotenv').config();
const express = require('express')
const passport = require('passport');;
const helmet = require('helmet');
const cors = require('cors');
const ApiError = require('./errors/apiError');


// --- Initialisation Passport ---
require('./config/passport'); 


// --- Import des Routeurs ---
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/ticket.routes');

// --- Import des Middlewares ---
const logger = require('./middlewares/logger.middleware');

// --- Gestionnaire d'erreurs ---
const errorHandler = require('./errors/errorHandler');

const app = express();


app.use(logger);

app.use(express.json());
app.use(passport.initialize());

// --- Middleware de sécurité ---
app.use(helmet());
app.use(cors());



// --- Définition des Routes ---
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/tickets', ticketRoutes);

app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
});



// --- Gestionnaire d'erreurs (doit être le dernier middleware) ---
app.use(errorHandler);




module.exports = app;