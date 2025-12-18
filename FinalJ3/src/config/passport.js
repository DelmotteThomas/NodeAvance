const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const AuthService = require('../services/auth.service');
const AppDataSource = require('./data-source');
const User = require('../entities/User');

const userRepository = AppDataSource.getRepository(User);

passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const { user } = await AuthService.login(email, password);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret',
};

passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const user = await userRepository.findOneBy({ id: payload.id });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);
