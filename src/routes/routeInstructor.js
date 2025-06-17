import { Router } from "express"
// #inicio modulos dickson
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFichaToInstructor,
  updateFichaFromInstructor,
  removeFichaFromInstructor,
  getUserStats,
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

// Rutas principales de instructores (usando controlador unificado)
routesInstructor.get("/", filterInstructors, getAllUsers)
routesInstructor.get("/stats", filterInstructors, getUserStats)
routesInstructor.get("/:id", getUserById)
routesInstructor.post("/", debugRequest, ensureInstructorType, createUser)
routesInstructor.put("/:id", debugRequest, ensureInstructorType, updateUser)
routesInstructor.delete("/:id", deleteUser)

// Rutas para manejar fichas de instructores
routesInstructor.post("/:id/fichas", debugRequest, addFichaToInstructor)
routesInstructor.put("/:id/fichas/:fichaId", debugRequest, updateFichaFromInstructor)
routesInstructor.delete("/:id/fichas/:fichaId", removeFichaFromInstructor)
// #fin modulos dickson

export default routesInstructor
