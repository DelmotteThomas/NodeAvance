import { seedProducts } from "../seeds/products.seed.js";

export default class ProductModel {
    constructor() {
        // On initialise avec les données de base pour les méthodes classiques
        this.products = seedProducts();
    }

    async findAll() {
        return this.products;
    }

    async findById(id) {
        return this.products.find((product) => product.id === Number(id));
    }

    async create(newProductData) { // Changement de nom ici pour éviter le conflit
        const newProduct = {
            id: this.products.length + 1,
            name: newProductData.name,
            price: newProductData.price,
            stock: newProductData.stock,
            active: newProductData.active ?? true,
            description: newProductData.description || "Pas de description"
        };
        
        this.products.push(newProduct);
        return newProduct;
    }
}