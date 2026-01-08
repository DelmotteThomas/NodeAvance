import { exportProducts } from '../services/product.service.js';

export async function exportProductsController(req, res, next) {
  try {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');

    await exportProducts(res);
  } catch (e) {
    next(e);
  }
}
