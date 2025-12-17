const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const AppDataSource = require('../config/data_source');
const {User} = require('../models/user.entity');

// ... Importez bcrypt, AppDataSource et votre entité User ici
module.exports = (passport) => {
// ==================================================
// 1. STRATÉGIE LOCAL (Sert uniquement au Login)
// ==================================================
passport.use(new LocalStrategy({
usernameField: 'email', // Indiquez à Passport quel champ sert d'identifiant
session: false // Désactivez les sessions (car on fait une API REST)
},

async (email, password, done) => {
    try {
// TODO :
// 1. Récupérez le Repository User via AppDataSource
const userRepo = AppDataSource.getRepository(User);
// 2. Cherchez l'utilisateur par son email.
const user = await userRepo.findOneBy({ email });
// 3. VÉRIFICATIONS :
// Si l'user n'existe pas OU si le mot de passe (bcrypt.compare) est faux :
// return done(null, false, { message: '...' });
if (!user) {
          // Utilisateur non trouvé
          return done(null, false, { message: 'Identifiants incorrects' });
        }
 const match = await bcrypt.compare(password, user.password);
 if (!match) {
          // Mot de passe incorrect
          return done(null, false, { message: 'Identifiants incorrects' });
        }
    
// 4. SUCCÈS :
// Tout est valide => authentification réussie
// return done(null, user);
return done(null, user);
}catch (err) {
        // En cas d'erreur interne
        return done(err);
    }
}
));
// ==================================================
// 2. STRATÉGIE JWT (Sert aux routes protégées)
// ==================================================
const jwtOptions = {
// Indiquez à Passport où trouver le token (Indice:

jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// Indiquez la clé secrète (process.env.JWT_SECRET)
secretOrKey: process.env.JWT_SECRET
};
passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
// TODO :
// Le "payload" contient les infos décodées du token (ex: payload.id)
// 1. Cherchez l'utilisateur dans la DB grâce à payload.id
// 2. Si l'utilisateur existe : return done(null, user);
// 3. Sinon : return done(null, false);
 try {
      // 1. Extraire l'ID utilisateur du payload JWT (selon comment le token a été signé, ex: payload.id)
      const userId = payload.id;  // ou payload.sub, selon le champ utilisé dans le JWT
      // 2. Rechercher l'utilisateur en base par cet ID
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: userId });
      // 3. Si l'utilisateur existe, authentification réussie
      if (user) {
        return done(null, user);
      } else {
        // 4. Sinon, échec d'authentification (utilisateur non trouvé)
        return done(null, false);
      }
    } catch (err) {
      // En cas d'erreur lors de la vérification (ex: problème de base de données)
      return done(err, false);
    }
}));
};
