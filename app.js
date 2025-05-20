import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';

const app = express();

// Conexión a la base de datos
await dbConnection();

// Middlewares
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json());

// Rutas agrupadas bajo /api
app.use('/api', routes);

export default app;
