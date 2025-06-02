import express from 'express';
import cors from 'cors';
import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';

import fileUpload from "express-fileupload"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();

// Conexión a la base de datos
await dbConnection();

// Middlewares
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.json({ limit: "50mb" }))
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    debug: true, // Habilitar depuración
    parseNested: true, // Permitir análisis de objetos anidados
    abortOnLimit: false, // No abortar en límite de tamaño
  }),
)

// Configurar ruta para servir archivos estáticos
// Asegurarse de que la ruta de uploads esté configurada correctamente
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Middleware para registrar todas las solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Añadir un middleware para depurar todas las solicitudes POST/PUT con más detalle
app.use((req, res, next) => {
  if ((req.method === "POST" || req.method === "PUT") && req.headers["content-type"]?.includes("multipart/form-data")) {
    console.log("\n=== DETALLE DE SOLICITUD MULTIPART ===")
    console.log("Headers completos:", req.headers)
    console.log("Body keys:", Object.keys(req.body))

    // Mostrar detalles de los archivos si existen
    if (req.files) {
      console.log("Files recibidos:", Object.keys(req.files))
      for (const key in req.files) {
        const file = req.files[key]
        console.log(`- Archivo ${key}:`, {
          nombre: file.name,
          tamaño: file.size,
          tipo: file.mimetype,
          tempFilePath: file.tempFilePath,
        })
      }
    } else {
      console.log("No se recibieron archivos")
    }

    // Si hay preguntas, mostrar su estructura
    if (req.body.preguntas) {
      try {
        const preguntas = typeof req.body.preguntas === "string" ? JSON.parse(req.body.preguntas) : req.body.preguntas

        console.log("Estructura de preguntas:", JSON.stringify(preguntas, null, 2).substring(0, 500) + "...")
      } catch (error) {
        console.log("Error al parsear preguntas:", error.message)
      }
    }

    console.log("=== FIN DETALLE DE SOLICITUD ===\n")
  }
  next()
})

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

// Manejar errores no capturados
process.on("uncaughtException", (err) => {
  console.error("ERROR NO CAPTURADO:", err)
  // No cerrar el proceso en producción, solo registrar el error
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("PROMESA RECHAZADA NO MANEJADA:", reason)
  // No cerrar el proceso en producción, solo registrar el error
})

export default app;
