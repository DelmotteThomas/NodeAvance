import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Product from '../models/Product.entity.js';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  entities: [Product],
});

export default AppDataSource;