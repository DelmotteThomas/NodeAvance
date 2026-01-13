const UserController = require ('./user.controller')

class UserController extends BaseController {
  constructor(userService) {
    super(userService);
  }
}

module.exports = UserController;