const log = document.getElementById('log');
const pingBtn = document.getElementById('pingBtn');

function addLog(message) {
  log.textContent += message + '\n';
}

addLog('🔌 Connexion au serveur...');

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  addLog(`✅ Connecté (${socket.id})`);
});

socket.on('disconnect', () => {
  addLog('❌ Déconnecté');
});

pingBtn.addEventListener('click', () => {
  addLog('📤 PING envoyé');
  socket.emit('my_ping', { message: 'Hello serveur' });
});

socket.on('my_pong', (data) => {
  addLog(`📩 Reçu du serveur : ${data.response}`);
});

socket.on('broadcast_msg', (data) => {
  addLog(` BROADCAST : ${data.message}`);
});