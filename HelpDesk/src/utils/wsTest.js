const { io } = require('socket.io-client');

console.log('🔌 Connexion au serveur WebSocket...');

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log(`✅ Connecté avec l'id ${socket.id}`);

  socket.emit('ping_helpdesk', {
    message: 'Hello depuis le script Node',
  });
});

socket.on('pong_helpdesk', (data) => {
  console.log('📩 Réponse serveur :', data);
  socket.disconnect();
});

socket.on('disconnect', () => {
  console.log('❌ Déconnecté');
  process.exit(0);
});


