import { Router } from "express"
import Role from "../models/role.js"
// #inicio modulos dickson
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFichaToInstructor,
  removeFichaFromInstructor,
  getUserStats,
  updateInstructorFichas, // Importar la nueva función
} from "../controllers/userController.js"

const routesInstructor = Router()

// Middleware para depurar solicitudes específicas de esta ruta
const debugRequest = (req, res, next) => {
  console.log(`=== SOLICITUD A ${req.method} ${req.originalUrl} ===`)
  console.log("Headers:", req.headers["content-type"])
  console.log("Body keys:", Object.keys(req.body))
  console.log("Query params:", req.query)
  next()
}

// Middleware para filtrar solo instructores
const filterInstructors = (req, res, next) => {
  req.query.tipoUsuario = "instructor"
  next()
}

// Middleware para asegurar que el body tenga tipoUsuario = instructor
const ensureInstructorType = (req, res, next) => {
  req.body.tipoUsuario = "instructor"
  next()
}

// Middleware para asignar rol de Instructor automáticamente
const assignInstructorRole = async (req, res, next) => {
  try {
    console.log("=== ASIGNANDO ROL DE INSTRUCTOR ===")

    const instructorRole = await Role.findOne({
      name: "Instructor",
      status: true,
    })

    if (!instructorRole) {
      console.error("No se encontró el rol 'Instructor' activo")
      return res.status(400).json({
        message: "No se encontró el rol 'Instructor'. Contacte al administrador.",
      })
    }

    console.log(`Rol de Instructor encontrado: ${instructorRole._id}`)
    req.body.role = instructorRole._id

    // Asegurar que la contraseña sea el documento si no se proporciona
    if (!req.body.contraseña && req.body.documento) {
      req.body.contraseña = req.body.documento
      console.log("Contraseña asignada automáticamente como el documento")
    }

    next()
  } catch (error) {
    console.error("Error al asignar rol de instructor:", error)
    res.status(500).json({
      message: "Error al asignar rol de instructor",
      error: error.message,
    })
  }
}

// Rutas principales de instructores (usando controlador unificado)
routesInstructor.get("/", filterInstructors, getAllUsers)
routesInstructor.get("/stats", filterInstructors, getUserStats)
routesInstructor.get("/:id", getUserById)
routesInstructor.post("/", debugRequest, ensureInstructorType, assignInstructorRole, createUser)
routesInstructor.put("/:id", debugRequest, ensureInstructorType, updateUser)
routesInstructor.delete("/:id", deleteUser)

// Rutas para manejar fichas de instructores
// Cambiar la ruta para añadir múltiples fichas (ahora recibe un array de IDs)
routesInstructor.post("/:id/fichas", debugRequest, addFichaToInstructor)
// NUEVA: Ruta para actualizar todas las fichas de un instructor (reemplaza el array completo)
routesInstructor.put("/:id/fichas", debugRequest, updateInstructorFichas)
// Mantener la ruta para eliminar ficha individual
routesInstructor.delete("/:id/fichas/:fichaId", removeFichaFromInstructor)
// #fin modulos dickson

export default routesInstructor
