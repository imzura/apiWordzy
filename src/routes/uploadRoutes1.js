import { Router } from "express"
import uploadController1 from "../controllers/uploadController1.js"

const routesUpload1 = Router()

console.log("Registrando rutas de upload...")

// Ruta para subir archivos - usando express-fileupload (sin multer)
routesUpload1.post("/", uploadController1.uploadFile)

export default routesUpload1