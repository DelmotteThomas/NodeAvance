// Import de la configuration DB (Singleton)
const AppDataSource = require("./config/data-source");

// Import Redis et PassPort
const createRedisClient = require("./config/redis.config");
const configurePassport = require("./config/passport.config");
const passport = require("passport");

// Import des classes concrètes

// --- COUCHE DATA (Repositories) ---
const UserRepository = require("./repositories/user.repository");

// --- COUCHE MÉTIER (Services) ---
const UserService = require("./services/user.service");
const AuthService = require("./services/auth.service");

// --- COUCHE PRESENTATION (Controllers) ---
const UserController = require("./controllers/user.controller");

async function createContainer() {
  // 1️ DB — infra critique
  await AppDataSource.initialize();
  console.log("DB ready");

  // 2️ Redis — infra optionnelle mais bloquante ici
  const redis = createRedisClient();
  await redis.connect();
  console.log("Redis ready");

  // 3️ Repository — accès données
  // Instancier le UserRepository en lui passant la AppDataSource
  const userRepository = new UserRepository(AppDataSource);

  // 4️ Services — logique métier
  // Instancier le UserService en lui injectant le userRepository
  const userService = new UserService(userRepository);

  // TP 3 — Service d'authentification (métier spécifique)
  const authService = new AuthService(userRepository);

  // 5️ Passport — adaptateur auth
  configurePassport(passport, {
    authService,
    userRepository,
  });
  console.log("Passport configured");

  // 6️ Controllers — couche présentation
  // Instancier le UserController en lui injectant le userService
  const userController = new UserController(userService);

  // 7️ Exposition contrôlée
  // On exporte uniquement les contrôleurs et services prêts à l'emploi
  return {
    passport,
    redis,
    userController,
    authService, // utile pour auth.controller (TP 3)
  };
}

module.exports = createContainer;
