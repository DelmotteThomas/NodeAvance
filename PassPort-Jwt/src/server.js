require('reflect-metadata');
require('dotenv').config();

const app = require('./app');
const AppDataSource = require('./config/data-source');

const PORT = process.env.PORT || 3000;

// Connexion à la base de données
AppDataSource.initialize()

  .then(() => {
    console.log('Base de données connectée');
// Démarrage du serveur ( seulement si on est connecté a la DB)
    app.listen(PORT, () => {
      console.log(` Le serveur est lancé sur le port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion à la BaseDeDonnee', error);
    process.exit(1);
  });
