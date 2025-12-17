const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const AppDataSource = require("../config/data-source");
const User = require("../models/user.entity");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // Indiquez à Passport quel champ sert d'identifiant
        session: false, // Désactivez les sessions (car on fait une API REST)
      },

      async (email, password, done) => {
        try {
          const userRepo = AppDataSource.getRepository(User);
          const user = await userRepo.findOneBy({ email });

          if (!user) {
            // Utilisateur non trouvé
            return done(null, false, { message: "Identifiants incorrects" });
          }
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            // Mot de passe incorrect
            return done(null, false, { message: "Identifiants incorrects" });
          }
          // Tout est valide => authentification réussie
          return done(null, user);
        } catch (err) {
          // En cas d'erreur interne
          return done(err);
        }
      }
    )
  );

  const jwtOptions = {
    // Indiquez à Passport où trouver le token (Indice:

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // Indiquez la clé secrète (process.env.JWT_SECRET)
    secretOrKey: process.env.JWT_SECRET,
  };
  passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        const userId = payload.id; // ou payload.sub, selon le champ utilisé dans le JWT
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id: userId });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
