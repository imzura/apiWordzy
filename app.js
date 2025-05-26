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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

export default app;
