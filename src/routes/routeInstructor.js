import { Router } from "express"
import {
  getAllInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  addFichaToInstructor,
  updateFichaFromInstructor,
  removeFichaFromInstructor,
  getInstructorStats,
} from "../controllers/instructorController.js"

const routesInstructor = Router()

// Middleware para depurar solicitudes específicas de esta ruta
const debugRequest = (req, res, next) => {
  console.log(`=== SOLICITUD A ${req.method} ${req.originalUrl} ===`)
  console.log("Headers:", req.headers["content-type"])
  console.log("Body keys:", Object.keys(req.body))
  console.log("Query params:", req.query)
  next()
}

// Rutas principales de instructores
routesInstructor.get("/", getAllInstructors)
routesInstructor.get("/stats", getInstructorStats)
routesInstructor.get("/:id", getInstructorById)
routesInstructor.post("/", debugRequest, createInstructor)
routesInstructor.put("/:id", debugRequest, updateInstructor)
routesInstructor.delete("/:id", deleteInstructor)

// Rutas para manejar fichas de instructores
routesInstructor.post("/:id/fichas", debugRequest, addFichaToInstructor)
routesInstructor.put("/:id/fichas/:fichaId", debugRequest, updateFichaFromInstructor)
routesInstructor.delete("/:id/fichas/:fichaId", removeFichaFromInstructor)

export default routesInstructor
