import express from 'express';
import routes from './routes/index.routes.js';
import errorHandler from './errors/error.handler.js';

const app = express();


app.use(express.json());
// servir le dossier public statiquement
app.use(express.static('public'));
app.use(routes);
app.use(errorHandler);

export default app;
