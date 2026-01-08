import { EntitySchema } from 'typeorm';

const ProductEntity = new EntitySchema({
  name: 'Product',
  tableName: 'products',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    description: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
});

export default ProductEntity;
