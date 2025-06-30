import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Crear directorio de uploads en la raíz del proyecto
const uploadsDir = path.join(__dirname, "../../uploads/support-materials")

// Función para crear directorio
const ensureUploadsDir = () => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
      console.log("📁 Directorio uploads creado:", uploadsDir)
    }
  } catch (error) {
    console.error("❌ Error al crear directorio uploads:", error)
  }
}

// Crear directorio al inicializar
ensureUploadsDir()

class UploadController {
  async uploadFile(req, res) {
    try {
      console.log("🚀 ===== INICIO UPLOAD =====")
      console.log("📋 req.files:", req.files)
      console.log("📋 req.body:", req.body)
      console.log("🔍 Keys de req.files:", req.files ? Object.keys(req.files) : "No files")

      // Verificar si hay archivos
      if (!req.files || Object.keys(req.files).length === 0) {
        console.log("❌ No se recibieron archivos")
        return res.status(400).json({
          success: false,
          message: "No se recibieron archivos",
          timestamp: new Date().toISOString(),
        })
      }

      // Buscar el archivo - puede estar en diferentes keys
      let file = null

      // Intentar diferentes formas de acceder al archivo
      if (req.files.file) {
        file = req.files.file
        console.log("✅ Archivo encontrado en req.files.file")
      } else if (Object.keys(req.files).length > 0) {
        // Tomar el primer archivo disponible
        const firstKey = Object.keys(req.files)[0]
        file = req.files[firstKey]
        console.log(`✅ Archivo encontrado en req.files.${firstKey}`)
      }

      if (!file) {
        console.log("❌ No se encontró ningún archivo válido")
        return res.status(400).json({
          success: false,
          message: "No se ha subido ningún archivo válido",
          timestamp: new Date().toISOString(),
        })
      }

      console.log("📄 Detalles del archivo:", {
        name: file.name,
        size: file.size,
        mimetype: file.mimetype,
        tempFilePath: file.tempFilePath,
      })

      // Validar tipo de archivo
      const allowedTypes = [
        // Imágenes
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        // Documentos
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        // Audio
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/ogg",
        "audio/mp4",
        "audio/x-m4a",
      ]

      if (!allowedTypes.includes(file.mimetype)) {
        console.log("❌ Tipo de archivo no permitido:", file.mimetype)
        return res.status(400).json({
          success: false,
          message: `Tipo de archivo no permitido: ${file.mimetype}`,
          timestamp: new Date().toISOString(),
        })
      }

      // Validar tamaño (50MB máximo)
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (file.size > maxSize) {
        console.log("❌ Archivo demasiado grande:", file.size)
        return res.status(400).json({
          success: false,
          message: "El archivo es demasiado grande (máximo 50MB)",
          timestamp: new Date().toISOString(),
        })
      }

      // Generar nombre único para el archivo
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      const extension = path.extname(file.name)
      const filename = "file-" + uniqueSuffix + extension
      const filePath = path.join(uploadsDir, filename)

      console.log("📂 Moviendo archivo desde:", file.tempFilePath)
      console.log("📂 Moviendo archivo a:", filePath)

      // Verificar que el archivo temporal existe
      if (!fs.existsSync(file.tempFilePath)) {
        console.log("❌ Archivo temporal no encontrado:", file.tempFilePath)
        return res.status(500).json({
          success: false,
          message: "Error: archivo temporal no encontrado",
          timestamp: new Date().toISOString(),
        })
      }

      // Mover el archivo desde temp a uploads
      await file.mv(filePath)

      console.log("✅ Archivo movido exitosamente")

      // Verificar que el archivo se movió correctamente
      if (!fs.existsSync(filePath)) {
        console.log("❌ Error: archivo no se movió correctamente")
        return res.status(500).json({
          success: false,
          message: "Error al mover el archivo",
          timestamp: new Date().toISOString(),
        })
      }

      // Construir URL del archivo
    //   const fileUrl = `/uploads/${filename}`
        const fileUrl = `/uploads/support-materials/${filename}`


      const fileInfo = {
        filename: filename,
        originalName: file.name,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
        path: filePath,
      }

      console.log("🎉 Archivo procesado exitosamente:", fileInfo)
      console.log("📤 Respuesta que se enviará:", {
        success: true,
        data: fileInfo,
        message: "Archivo subido exitosamente",
      })

      // Respuesta en formato consistente
      return res.status(200).json({
        success: true,
        data: fileInfo,
        message: "Archivo subido exitosamente",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("❌ Error en uploadFile:", error)
      return res.status(500).json({
        success: false,
        message: `Error al subir el archivo: ${error.message}`,
        timestamp: new Date().toISOString(),
      })
    }
  }
}

export default new UploadController()
