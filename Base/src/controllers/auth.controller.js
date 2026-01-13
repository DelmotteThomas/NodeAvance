const BaseController = require('../core/base-controller');

class AuthController extends BaseController {
  constructor(authService) {
    super(authService);
    this.authService = authService;
  }

  async register(req, res) {
    const { username, password } = req.body;

    try {
      const result = await this.authService.register(username, password);
      res.status(201).json(result);
    } catch (error) {
      if (error.message === 'Username déjà pris') {
        return res.status(409).json({ message: error.message });
      }

      if (error.message === 'Username et password requis') {
        return res.status(400).json({ message: error.message });
      }

      throw error;
    }
  }

  login(req, res) {
    res.json({
      message: 'Connecté',
      user: req.user.username,
    });
  }
}

module.exports = AuthController;
