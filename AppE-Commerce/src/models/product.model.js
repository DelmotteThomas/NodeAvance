import { seedProducts } from "../seeds/products.seed.js";

export default class ProductModel {
    
    
    
    
    constructor(id , name, price , stock, active = true){
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.active = active;

        this.products = seedProducts();
    }

    async findAll(){
        return this.products;
    }

    async findById(id){
        return this.products.find((product) => product.id === Number(id));
    }

    async create(product){
        const product ={
        name : product.name,
        price : product.price,
        stock : product.stock,
        active : product.active,
        id : this.products.length + 1
        };
        
        this.products.push(product);
        return product;
    }


}