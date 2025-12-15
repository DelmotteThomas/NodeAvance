import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/users', userController.getAll);
router.post('/users', userController.create);

export default router;
