import { Router } from 'express';
import { exportProductsController } from '../controllers/product.controller.js';

const router = Router();

router.get('/products/export', exportProductsController);

export default router;
