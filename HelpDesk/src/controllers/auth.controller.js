const AuthService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

class AuthController {
    register = asyncHandler(async (req, res) => {
        const { email, password, role } = req.body;
        const user = await AuthService.register(email, password, role);
        res.status(201).json({ status: 'success', data: { user } });
    });

    login = asyncHandler(async (req, res) => {
        // Passport a déjà validé l'utilisateur et l'a attaché à req.user
        const result = await AuthService.login(req.user);
        res.status(200).json({ status: 'success', data: result });
    });

    refresh = asyncHandler(async (req, res) => {
        const { refreshToken } = req.body;
        const tokens = await AuthService.refresh(refreshToken);
        res.status(200).json({ status: 'success', data: tokens });
    });
}

module.exports = new AuthController();
