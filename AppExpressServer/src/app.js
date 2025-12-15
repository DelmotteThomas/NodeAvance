// app.js
// la configuration de l'application Express
// charge les variables d'environnement
import 'dotenv/config';

// importe express
import express from 'express';
import routes from './routes/index.js';
import errorHandler from './errors/errorHandler.js';


// crée une instance d'Express
const app = express();
app.use(express.json());
// servir des fichiers statiques depuis le dossier "public"
app.use(express.static('public'));

// Définitir le chemin pour les routes
app.use(routes);

// gestion des erreurs Toujours a la fin
app.use(errorHandler);

export default app;
