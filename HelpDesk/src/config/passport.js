const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const AppDataSource = require("../config/data-source");
const User = require("../models/user.entity");
const AuthService = require("../services/auth.service");
const passport = require("passport");

const userRepo = AppDataSource.getRepository(User);

passport.use(
  // Jeton Local
  new LocalStrategy(
    { usernameField: 'email' }, // <--- AJOUTEZ CETTE LIGNE
    async (email, password, done) => {
      try {
        const user = await AuthService.validateUser(email, password); // Appelle maintenant la bonne méthode
        return done(null, user);
      } catch (err) {
        return done(null, false, { message: err.message });
      }
    }
  )
);
// JEton JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "secret",
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await userRepo.findOneBy({ id: payload.id });
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
