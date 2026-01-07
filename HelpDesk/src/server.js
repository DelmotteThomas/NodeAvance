require('reflect-metadata');
require('dotenv').config();

const http = require('http');
const app = require('./app');
const AppDataSource = require('./config/data-source');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Base de données connectée');

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: '*', // le navigateur A LE DROIT de se connecter
      },
    });

    io.on('connection', (socket) => {
      console.log(`🟢 Client connecté : ${socket.id}`);
      
      socket.on('my_ping', (data) => {
    console.log('📩 Ping reçu :', data);

    // Réponse UNIQUEMENT à ce client
     socket.emit('my_pong', {
       response: 'Bien reçu, Roger !',
     });
    // Réponse a tous les client 
    io.emit('broadcast_msg', {
    message: `📢 Quelqu'un a pingué ! C'est ${socket.id}`
  });
  });

      socket.on('disconnect', () => {
        console.log(`🔴 Client déconnecté : ${socket.id}`);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Serveur HTTP + WebSocket lancé sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion à la BaseDeDonnee', error);
    process.exit(1);
  });
