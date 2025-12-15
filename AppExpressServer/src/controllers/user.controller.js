import { asyncHandler } from '../utils/asyncHandler.js';
import userService from '../services/user.service.js';

class UserController {
  getAll = asyncHandler(async (req, res) => {
    const users = await userService.getAll();
    res.json(users);
  });

  create = asyncHandler(async (req, res) => {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  });
}

export default new UserController();
