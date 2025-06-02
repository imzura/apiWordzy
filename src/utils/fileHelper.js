import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuración para almacenamiento de archivos
const uploadsDir = path.join(__dirname, "../uploads")

// Asegurar que el directorio de uploads existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

/**
 * Guarda un archivo en el sistema de archivos
 * @param {Object} file - Objeto de archivo de express-fileupload
 * @param {string} prefix - Prefijo para el nombre del archivo
 * @param {number} index - Índice para diferenciar archivos (opcional)
 * @returns {string} - Ruta relativa del archivo guardado
 */
export const saveFile = async (file, prefix, index = "") => {
  if (!file) return null

  try {
    const fileExt = path.extname(file.name)
    const fileName = `${prefix}_${Date.now()}_${index}${fileExt}`
    const filePath = path.join(uploadsDir, fileName)

    // Guardar el archivo
    await file.mv(filePath)

    // Devolver la ruta relativa para acceso desde el frontend
    return `/uploads/${fileName}`
  } catch (error) {
    console.error(`Error al guardar archivo ${prefix}:`, error)
    throw error
  }
}

/**
 * Elimina un archivo del sistema de archivos
 * @param {string} filePath - Ruta relativa del archivo a eliminar
 * @returns {boolean} - true si se eliminó correctamente, false si no
 */
export const deleteFile = (filePath) => {
  if (!filePath) return false

  try {
    const fullPath = path.join(__dirname, "..", filePath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      console.log(`Archivo eliminado: ${filePath}`)
      return true
    }
    return false
  } catch (error) {
    console.error(`Error al eliminar archivo ${filePath}:`, error)
    return false
  }
}

/**
 * Obtiene la URL completa para un archivo
 * @param {string} filePath - Ruta relativa del archivo
 * @param {Object} req - Objeto request de Express
 * @returns {string} - URL completa del archivo
 */
export const getFileUrl = (filePath, req) => {
  if (!filePath) return null

  // Construir la URL base
  const protocol = req.protocol
  const host = req.get("host")
  const baseUrl = `${protocol}://${host}`

  // Si la ruta ya comienza con http o https, devolverla tal cual
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath
  }

  // Asegurarse de que la ruta comience con /
  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`

  return `${baseUrl}${normalizedPath}`
}
