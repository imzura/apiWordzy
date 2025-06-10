import { Router } from "express";
import UploadController from "../controllers/uploadController.js";

const routesUpload = Router();

console.log("Registrando rutas de upload...")

// Ruta para subir archivos
routesUpload.post("/", (req, res, next) => {
  console.log("=== RUTA UPLOAD LLAMADA ===")
  console.log("Method:", req.method)
  console.log("URL:", req.url)
  console.log("Headers:", req.headers)

  // Aplicar middleware de multer
  UploadController.uploadSingle(req, res, (err) => {
    if (err) {
      console.error("Error en multer middleware:", err)
      return res.status(400).json({
        success: false,
        message: `Error al procesar archivo: ${err.message}`,
        timestamp: new Date().toISOString(),
      })
    }

    // Llamar al controlador
    UploadController.uploadFile(req, res)
  })
})

export default routesUpload;
