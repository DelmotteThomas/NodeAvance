import ProductModel from "../models/product.model.js";

class ProductService {
    constructor() {
        this.productModel = new ProductModel();
    }

    async findAll() {
        return await this.productModel.findAll();
    }

    async findById(id) {
        return await this.productModel.findById(id);
    }

    async create(product) {

        if(product.price >0)
        {   
            throw new ValidationError('Le prix doit être possitif');
        }
        return await this.productModel.create(product);
    }


}