const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });


const requireRole = (role) => {
return (req, res, next) => {
        // 1. req.user contient l'utilisateur connecté (grâce à requireAuth avant)
        if (!req.user) {
            // Si pas d'user (cas rare mais possible), renvoyer 401.
            return res.status(401).json({ message: 'Authentification requise' });
        }

        // 2. Comparer req.user.role avec le 'role' demandé en argument
        if (req.user.role !== role) {
            // -> Si ça ne matche pas :
            // Renvoyer une erreur 403 (Forbidden) avec message "Droits insuffisants"
            return res.status(403).json({ message: 'Droits insuffisants' });
        }

        // 3. Si tout est bon :
        // Appeler next() pour laisser passer
        next();
};
};
module.exports = { requireAuth, requireRole }