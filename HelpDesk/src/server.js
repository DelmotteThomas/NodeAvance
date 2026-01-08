require("reflect-metadata");
require("dotenv").config();

const http = require("http");
const passport = require("passport");
const app = require("./app");
const AppDataSource = require("./config/data-source");
const { Server } = require("socket.io");

const sessionMiddleware = require("./middlewares/session.middleware");

const PORT = process.env.PORT || 3000;

// Utilitaire express → socket.io
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);
// On force TypeORM à connaître nos deux entités : User (déjà là) et Message (nouveau)
AppDataSource.setOptions({ entities: [require('./models/user.entity'), require('./models/message.entity')] });
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Base de données connectée");

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // On attache io à l'app pour les routes API (comme /api/admin/notify)
    app.set('io', io);

    // MIDDLEWARES SOCKET
    io.use(wrap(sessionMiddleware));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    //  GUARD D'AUTH
    io.use((socket, next) => {
      if (socket.request.user) return next();
      next(new Error("Unauthorized: Veuillez vous connecter"));
    });

    // LOGIQUE DE CONNEXION
    io.on("connection", (socket) => {
      const user = socket.request.user;
      // On envoie l'email au client dès qu'il se connecte
      socket.emit("auth_success", { email: user.email });
      console.log(`👤 Client connecté: ${socket.id} - (${user.email})`);

      // 1. REJOINDRE LES ROOMS (TP 3)
      // Utilisation du même format que ta route notify : user_ID
      socket.join(`user_${user.id}`);
      socket.join("general");
      
      console.log(`🔑 ${user.email} a rejoint user_${user.id} et room:general`);

      // 2. ÉCOUTEUR PING / PONG
      socket.on("my_ping", (data) => {
        console.log(`📨 Ping de ${user.email}`);
        socket.emit("my_pong", {
          response: `Pong reçu ! Bonjour ${user.email}.`,
        });
        socket.broadcast.emit("broadcast_msg", {
          message: `📢 ${user.email} vient d'envoyer un signal.`,
        });
      });

      // 3. ÉCOUTEUR CHAT AVEC SAUVEGARDE
    socket.on("chat_message", async (data) => {
  try {
    console.log(`💬 Message reçu de ${user.email} : ${data.content}`);

    // Sauvegarde en base de données
    const messageRepo = AppDataSource.getRepository("Message");
    await messageRepo.save({
        content: data.content,
        sender: user,
        room: 'general'
    });

    // Rediffusion à TOUTE la room 'general'
    io.to("general").emit("new_message", {
      from: user.email,
      senderId: socket.id, 
      content: data.content,
      time: new Date().toLocaleTimeString()
    });
  } catch (err) {
    console.error("Erreur lors de l'envoi du message:", err);
  }
});

      socket.on("disconnect", () => {
        console.log(`🔴 ${user.email} a quitté le socket.`);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Serveur HTTP + WebSocket lancé sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur DB", error);
    process.exit(1);
  });