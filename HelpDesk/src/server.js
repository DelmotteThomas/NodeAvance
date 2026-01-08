require("reflect-metadata");
require("dotenv").config();

const http = require("http");
const passport = require("passport");
const app = require("./app");
const AppDataSource = require("./config/data-source");
const { Server } = require("socket.io");

const sessionMiddleware = require("./middlewares/session.middleware");

const PORT = process.env.PORT || 3000;

// utilitaire express → socket.io
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

AppDataSource.initialize()
  .then(() => {
    console.log("Base de données connectée");

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        // ❌ Ne pas utiliser "*" avec credentials: true
        // ✅ Utiliser l'URL exacte de ton interface de test
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // ✅ MIDDLEWARES SOCKET (ORDRE CRUCIAL)
    io.use(wrap(sessionMiddleware));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    // ✅ GUARD D'AUTH SOCKET
    io.use((socket, next) => {
      if (socket.request.user) return next();
      next(new Error("Unauthorized"));
    });

    // ✅ CONNECTION
    io.on("connection", (socket) => {
      const user = socket.request.user;

      // Log de connexion sécurisé
      console.log(`👤 Utilisateur ${user.email} (Rôle: ${user.role}) connecté`);

      socket.on("my_ping", (data) => {
        console.log(`📨 Ping de ${user.email} :`, data);

        // Réponse directe au client qui a cliqué
        socket.emit("my_pong", {
          response: `Pong reçu ! Bonjour ${user.email}.`,
        });

        // Broadcast à TOUS les autres (pour simuler une notification de ticket par exemple)
        // On le met ici pour qu'il ne se déclenche que lors du clic
        socket.broadcast.emit("broadcast_msg", {
          message: `📢 ${user.email} (${user.role}) vient d'envoyer un signal.`,
        });
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
    console.error("Erreur DB", error);
    process.exit(1);
  });
