import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from 'url';
import { dirname } from "path"
import { errorResponse, successResponse } from "../utils/responseHandler.js"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, "../../uploads")

// Función para crear directorio
const ensureUploadsDir = () => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
      console.log("Directorio uploads creado:", uploadsDir)
    }
  } catch (error) {
    console.error("Error al crear directorio uploads:", error)
  }
}

// Crear directorio al inicializar
ensureUploadsDir()

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegurar que el directorio existe
    ensureUploadsDir()
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    try {
      // Generar nombre único para el archivo
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      const extension = path.extname(file.originalname)
      const filename = file.fieldname + "-" + uniqueSuffix + extension
      console.log("Generando nombre de archivo:", filename)
      cb(null, filename)
    } catch (error) {
      console.error("Error al generar nombre de archivo:", error)
      cb(error)
    }
  },
})

// Filtro para tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  console.log("Verificando tipo de archivo:", file.mimetype)

  const allowedTypes = {
    // Imágenes
    "image/jpeg": true,
    "image/jpg": true,
    "image/png": true,
    "image/gif": true,
    "image/webp": true,
    // Documentos
    "application/pdf": true,
    "application/msword": true,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
    "application/vnd.ms-excel": true,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": true,
    "application/vnd.ms-powerpoint": true,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": true,
    "text/plain": true,
    // Audio
    "audio/mpeg": true,
    "audio/mp3": true,
    "audio/wav": true,
    "audio/ogg": true,
    "audio/mp4": true,
  }

  if (allowedTypes[file.mimetype]) {
    console.log("Tipo de archivo permitido:", file.mimetype)
    cb(null, true)
  } else {
    console.log("Tipo de archivo no permitido:", file.mimetype)
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
})

class UploadController {
  constructor() {
    // Bind methods to preserve context
    this.uploadFile = this.uploadFile.bind(this)
  }

  // Middleware para subir un solo archivo
  uploadSingle = upload.single("file")

  async uploadFile(req, res) {
    try {
      console.log("=== INICIO UPLOAD ===")
      console.log("Archivo recibido:", req.file)
      console.log("Body:", req.body)

      if (!req.file) {
        console.log("No se recibió ningún archivo")
        return errorResponse(res, "No se ha subido ningún archivo", 400)
      }

      // Construir URL del archivo
      const fileUrl = `/uploads/${req.file.filename}`

      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      }

      console.log("Archivo procesado exitosamente:", fileInfo)

      return successResponse(res, "Archivo subido exitosamente", fileInfo)
    } catch (error) {
      console.error("Error en uploadFile:", error)
      return errorResponse(res, `Error al subir el archivo: ${error.message}`, 500)
    }
  }
}

export default new UploadController()
