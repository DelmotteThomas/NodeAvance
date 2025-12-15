import { asyncHandler } from "../utils/asyncHandler";
import ProductService from '../services/product.service';

class ProductController {
    findall = asyncHandler(async (req, res) => {
    const products = await this.productService.findAll();
    res.json(products);
    });

    create = asyncHandler(async (req, res) => {
        const product = await this.productService.create(req.body);
        res.status(201).json(product);
    });

    findById = asyncHandler(async (req, res) => {
        const product = await this.productService.findById(req.params.id);
        res.json(product);
    });

}

 export default new ProductController();