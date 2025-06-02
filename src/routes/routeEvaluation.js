import express from "express"
import {
  getAllEvaluations,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
} from "../controllers/evaluationController.js"
import { sanitizeEvaluationData } from "../middlewares/sanitizeData.js"

const routesEvaluation = express.Router()

// Middleware para depurar solicitudes específicas de esta ruta
const debugRequest = (req, res, next) => {
  console.log(`=== SOLICITUD A ${req.method} ${req.originalUrl} ===`)
  console.log("Headers:", req.headers["content-type"])
  console.log("Body keys:", Object.keys(req.body))
  console.log("Files:", req.files ? Object.keys(req.files) : "No hay archivos")
  next()
}

// Rutas de evaluaciones con middleware de sanitización y depuración
routesEvaluation.get("/", getAllEvaluations)
routesEvaluation.get("/:id", getEvaluationById)
routesEvaluation.post("/", debugRequest, sanitizeEvaluationData, createEvaluation)
routesEvaluation.put("/:id", debugRequest, sanitizeEvaluationData, updateEvaluation)
routesEvaluation.delete("/:id", deleteEvaluation)

export default routesEvaluation
