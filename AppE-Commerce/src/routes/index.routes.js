import { Router } from 'express';
import { exportProductsController ,importProductsController  } from '../controllers/product.controller.js';

const router = Router();

// EXPORT DB → CSV (TP1)
router.get('/products/export', exportProductsController);

// IMPORT CSV → DB (TP4)
router.post('/products/import', importProductsController);

export default router;
