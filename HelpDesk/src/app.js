// --- Dépendances ---
// Utilisation des fichier . env
require('dotenv').config();
// serveur
const express = require('express');
// Gerer l'authentification
const passport = require('passport');
// Protection du HEADER
const helmet = require('helmet');
// Securisation 
const cors = require('cors');
// Gestion des erreurs 
const { ApiError } = require('./errors/apiError');
// Gestion des DoS / tentative de connexion 
const {globalLimiter} = require('./middlewares/rateLimiter');
// Nettoyage des requetes avant d'envoyer au Server Empeche les injections
const sanitizer = require('./middlewares/sanitizer');

const morgan = require ('morgan');
// pour gerer les parms URL ( éviter les double id par exemple)
const hpp = require('hpp');

const sessionMiddleware = require('./middlewares/session.middleware');

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
const statsRoutes = require('./routes/stats.routes');

// --- Import des Middlewares ---
const logger = require('./middlewares/logger.middleware');

// --- Gestionnaire d'erreurs ---
const errorHandler = require('./errors/errorHandler');

const app = express();

// -- Loging Espion --
// Placer tout en haut, avant Helmet / Cors / et les routes
// Placez-le TOUT EN HAUT, avant Helmet, Cors, et les Routes. // Le format 'dev' est coloré et concis pour le développement. 
// Le format 'combined' est standard pour la prod (Apache style).

app.use(morgan('dev'));
app.use(express.json());
app.use(sanitizer);
app.use(sessionMiddleware);

// Stockage temporaire en mémoire (pour la démo HACKER-BOARD)
const messages = [];
app.get('/messages', (req, res) => res.json(messages));
app.post('/messages', (req, res) => { 
// Faille : On stocke directement ce qu'on reçoit sans nettoyer
const { content } = req.body; messages.push({ content, date: new Date() });
res.json({ status: 'success' }); });

app.use(passport.initialize());
app.use(passport.session());
app.use(logger);

// --- Middleware de sécurité ---
// app.use(
//   helmet()
// );
// Utiliser les option Cors pour proteger le HEADER des attaques extérieur
app.use(cors(corsOption));
app.use(globalLimiter);
// Parser JSON

// A placer  avant les routes mais après le body parser ! pour nettoyer toutes les requetes entrantes
app.use(hpp())

// Déservir les fichiers statiques
app.use(express.static('public'));

// --- Définition des Routes ---
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/stats', statsRoutes);

// Route temporaire pour tester 

app.post('/api/admin/notify/:userId', (req, res) => {
    const io = req.app.get('io'); // Récupération sécurisée
    const targetUserId = req.params.userId;
    const { message } = req.body;

    // Attention : utilise le même séparateur partout (ici underscore _)
    io.to(`user_${targetUserId}`).emit('notification', {
        type: 'private',
        text: message,
        from: 'System Admin'
    });
    res.json({ status: 'Notification envoyée' });
});

app.use((req, res, next) => {
    next(new ApiError(404, 'Not Found'));
});


// --- Gestionnaire d'erreurs (doit être le dernier middleware) ---
app.use(errorHandler);

module.exports = app;