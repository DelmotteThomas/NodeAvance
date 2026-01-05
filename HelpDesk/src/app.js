// --- Dépendances ---
require('dotenv').config();
const express = require('express')
const passport = require('passport');;
const helmet = require('helmet');
const cors = require('cors');
const { ApiError } = require('./errors/apiError');


// --- Initialisation Passport ---
require('./config/passport');

// Initialisation de Cors
// Liste des domaines autorisés
const whitelist = ['http://localhost:5500', 'http://localhost:4200'];

const corsOption = {
    origin: function (origin, callback){
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Bloqué par CORS, domaine non autorisé'));
        }
    },
    methods : ['GET','POST','PUT','DELETE'], // Verbe HTML autorisé
    allowedHeaders : ['Content-Type', 'Authorization'] // Header autorisés
};


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
// Utiliser les option Cors pour proteger le HEADER des attaques extérieur
app.use(cors(corsOption));

// --- Middleware de sécurité ---
app.use(helmet());
app.use(cors());



// --- Définition des Routes ---
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
});



// --- Gestionnaire d'erreurs (doit être le dernier middleware) ---
app.use(errorHandler);




module.exports = app;