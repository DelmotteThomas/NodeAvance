const AuthService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const passport = require('passport');

class AuthController {
    register = asyncHandler(async (req, res) => {
        const { email, password, role } = req.body;
        const user = await AuthService.register(email, password, role);
        res.status(201).json({ status: 'success', data: { user } });
    });
     // 🔑 LOGIN AVEC SESSION REDIS 
    login = asyncHandler(async (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: info?.message || 'Authentication failed',
                });
            }

            // 🔥 CRÉATION DE LA SESSION
            req.login(user, (err) => {
                if (err) return next(err);

                return res.status(200).json({
                    status: 'success',
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                        },
                    },
                });
            });
        })(req, res, next);
    });


    // DECOMMANTER POUR UTILISER AVEC JWT 
    // login = asyncHandler(async (req, res) => {
    //     // Passport a déjà validé l'utilisateur et l'a attaché à req.user
    //     const result = await AuthService.login(req.user);
    //     res.status(200).json({ status: 'success', data: result });
    // });

    // refresh = asyncHandler(async (req, res) => {
    //     const { refreshToken } = req.body;
    //     const tokens = await AuthService.refresh(refreshToken);
    //     res.status(200).json({ status: 'success', data: tokens });
    // });
}

module.exports = new AuthController();
