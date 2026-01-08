// Sélection des éléments du DOM
const log = document.getElementById("log");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const pingBtn = document.getElementById("pingBtn");
const statusIndicator = document.getElementById("status-indicator");
/**
 * Fonction pour ajouter une bulle au chat
 * side = 'me' (droite/vert) ou 'others' (gauche/blanc)
 */
function appendBubble(data, side) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("message-wrapper", side);

  // On gère le format de l'heure et du contenu
  const time = data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const content = data.content || data.text || "";
  
  // Si c'est moi, j'affiche "Moi", sinon l'email envoyé par le serveur
  const sender = side === 'me' ? "Moi" : (data.from || "Anonyme");

  wrapper.innerHTML = `
    <div class="bubble">
      <span class="msg-info">${sender} • ${time}</span>
      <div class="msg-text">${content}</div>
    </div>
  `;

  log.appendChild(wrapper);
  log.scrollTop = log.scrollHeight; // Scroll automatique vers le bas
}

// 1. Connexion au serveur
const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

// 2. Événement de connexion
socket.on("connect", () => {
  statusIndicator.textContent = "✅ En ligne";
  statusIndicator.classList.remove("offline"); // Optionnel : pour le style CSS
  console.log("Connecté au serveur avec l'ID socket :", socket.id);
});
// Quand la connexion est perdue (serveur coupé ou crash)
socket.on("disconnect", (reason) => {
  statusIndicator.textContent = "❌ Hors ligne";
  statusIndicator.style.backgroundColor = "red"; // Changement visuel immédiat
  console.log("Déconnecté du serveur. Raison :", reason);
});

// Quand le serveur revient et qu'on tente de se reconnecter
socket.on("reconnect_attempt", () => {
  statusIndicator.textContent = "⏳ Tentative de reconnexion...";
});

// 3. Écouteur des messages
socket.on("new_message", (data) => {
  console.log("Message reçu. ID expéditeur :", data.senderId, " | Mon ID :", socket.id);

  // LOGIQUE SIMPLE ET ROBUSTE :
  // Si l'ID qui a envoyé le message (data.senderId) est DIFFÉRENT de mon ID (socket.id)
  // Alors c'est quelqu'un d'autre -> J'affiche à gauche.
  // Sinon, c'est moi -> J'ignore (car j'ai déjà affiché à droite).
  
  if (data.senderId !== socket.id) {
    appendBubble(data, "others");
  }
});

// 4. Gestion de l'envoi
function handleSend() {
  const text = messageInput.value.trim();
  if (text) {
    // A. Envoi au serveur
    socket.emit("chat_message", { content: text });
    
    // B. Affichage iméadit à droite 
    appendBubble({ content: text }, "me");
    
    // C. Je vide le champ
    messageInput.value = "";
  }
}

// 5. Événements (Clic et Entrée)
sendBtn.onclick = handleSend;

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});

// 6. Ping (Pour tester)
if(pingBtn) {
    pingBtn.addEventListener("click", () => {
      socket.emit("my_ping", { message: "Ping test" });
    });
}

socket.on("my_pong", (data) => {
  appendBubble({ content: data.response, from: "Serveur" }, "system");
});