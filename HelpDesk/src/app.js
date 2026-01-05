// --- Dépendances ---
require('dotenv').config();
const express = require('express')
const passport = require('passport');;
const helmet = require('helmet');
const cors = require('cors');
const { ApiError } = require('./errors/apiError');
const {globalLimiter} = require('./middlewares/rateLimiter');
const sanitizer = require('./middlewares/sanitizer');

// pour gerer les parms URL ( éviter les double id par exemple)
const hpp = require('hpp');


// --- Initialisation Passport ---
require('./config/passport');

// Initialisation de Cors
// Liste des domaines autorisés
const whitelist = ['http://localhost:5500', 'http://localhost:4200', 'http://localhost:3000'];


// Origin c'est ce qu'envoie un serv a un navigateur
const corsOption = {
    origin: function (origin, callback){
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Bloqué par CORS, domaine non autorisé'));
        }
    },
    credentials:true, // Autoriser les cookies
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
app.use(express.json());
app.use(sanitizer);
// Stockage temporaire en mémoire (pour la démo)
const messages = [];
app.get('/messages', (req, res) => res.json(messages));
app.post('/messages', (req, res) => { 
// Faille : On stocke directement ce qu'on reçoit sans nettoyer
const { content } = req.body; messages.push({ content, date: new Date() });
res.json({ status: 'success' }); });

app.use(logger);

// --- Middleware de sécurité ---
//app.use(helmet());
// Utiliser les option Cors pour proteger le HEADER des attaques extérieur
//app.use(cors(corsOption));
//app.use(globalLimiter);

// Parser JSON

//app.use(passport.initialize());


// A placer  avant les routes mais après le body parser ! pour nettoyer toutes les requetes entrantes
app.use(hpp())



// Déservir les fichiers statiques
app.use(express.static('public'));

// --- Définition des Routes ---
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Routes de TEST
app.get('/test-hpp', (req, res) => { console.log("Paramètre id reçu :", req.query.id); res.send(req.query.id); });

app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
});



// --- Gestionnaire d'erreurs (doit être le dernier middleware) ---
app.use(errorHandler);




module.exports = app;