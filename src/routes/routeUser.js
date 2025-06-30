// #inicio modulos dickson
import { Router } from "express"
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProgress,
  updatePoints,
  addFichaToInstructor,
  removeFichaFromInstructor,
  getUserStats,
  massUpdateUsers,
  updateInstructorFichas, // Importar la nueva función
} from "../controllers/userController.js"

const routesUser = Router()

// Middleware para depurar solicitudes específicas de esta ruta
const debugRequest = (req, res, next) => {
  console.log(`=== SOLICITUD A ${req.method} ${req.originalUrl} ===`)
  console.log("Headers:", req.headers["content-type"])
  console.log("Body keys:", Object.keys(req.body))
  console.log("Query params:", req.query)
  next()
}

// Rutas principales de usuarios
routesUser.get("/", getAllUsers)
routesUser.get("/stats", getUserStats)
routesUser.get("/:id", getUserById)
routesUser.post("/", debugRequest, createUser)
routesUser.put("/:id", debugRequest, updateUser)
routesUser.delete("/:id", deleteUser)

// Ruta específica para actualizar progreso de aprendices
routesUser.patch("/:id/progress", debugRequest, updateProgress)

// NUEVA RUTA: Actualizar puntos de aprendices
routesUser.patch("/:id/points", debugRequest, updatePoints)

// Ruta para actualización masiva
routesUser.patch("/mass-update", debugRequest, massUpdateUsers)

// Rutas para manejar fichas de instructores
// Cambiar la ruta para añadir múltiples fichas (ahora recibe un array de IDs)
routesUser.post("/:id/fichas", debugRequest, addFichaToInstructor)
// NUEVA: Ruta para actualizar todas las fichas de un instructor (reemplaza el array completo)
routesUser.put("/:id/fichas", debugRequest, updateInstructorFichas)
// Mantener la ruta para eliminar ficha individual
routesUser.delete("/:id/fichas/:fichaId", removeFichaFromInstructor)

export default routesUser
// #fin modulos dickson
