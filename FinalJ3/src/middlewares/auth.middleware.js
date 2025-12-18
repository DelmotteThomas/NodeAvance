const passport = require('passport');
const ApiError = require('../utils/ApiError');

const requireAuth = passport.authenticate('jwt', { session: false });

const requireRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        next();
    } else {
        next(new ApiError(403, 'Forbidden: Insufficient rights'));
    }
};

module.exports = {
    requireAuth,
    requireRole,
};
