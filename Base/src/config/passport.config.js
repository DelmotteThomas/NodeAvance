const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function configurePassport(passport, { authService, userRepository }) {

  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await authService.validateUser(email, password);
          return done(null, user);
        } catch (err) {
          return done(null, false, { message: err.message });
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'secret',
      },
      async (payload, done) => {
        try {
          const user = await userRepository.findOneBy({ id: payload.id });
          return user ? done(null, user) : done(null, false);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userRepository.findOneBy({ id });
      done(null, user || false);
    } catch (err) {
      done(err);
    }
  });
};
