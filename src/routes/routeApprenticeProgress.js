import { Router } from "express"
import { body, param, query } from "express-validator"
import {
  getApprenticeProgress,
  getProgressByApprenticeAndLevel,
  getProgressByCourse,
  getProgressById,
  createApprenticeProgress,
  updateApprenticeProgress,
  deleteApprenticeProgress,
  getFichaRanking,
  getProgressStatistics,
} from "../controllers/apprenticeProgressController.js"

const routeApprenticeProgress = Router()

// Validaciones para crear progreso
const createProgressValidation = [
  body("apprenticeId").isMongoId().withMessage("ID de aprendiz requerido y válido"),
  body("courseId").isMongoId().withMessage("ID de curso requerido y válido"),
  body("courseProgrammingId").isMongoId().withMessage("ID de programación requerido y válido"),
  body("evaluationId").isMongoId().withMessage("ID de evaluación requerido y válido"),
  body("level").isInt({ min: 1, max: 6 }).withMessage("Nivel debe ser entre 1 y 6"),
  body("score").isNumeric().withMessage("Puntaje debe ser numérico"),
  body("maxScore").isNumeric().withMessage("Puntaje máximo debe ser numérico"),
  body("timeSpent").optional().isNumeric().withMessage("Tiempo debe ser numérico"),
  body("answers").optional().isArray().withMessage("Respuestas debe ser un array"),
]

// Validaciones para actualizar progreso
const updateProgressValidation = [
  param("id").isMongoId().withMessage("ID inválido"),
  body("score").optional().isNumeric().withMessage("Puntaje debe ser numérico"),
  body("timeSpent").optional().isNumeric().withMessage("Tiempo debe ser numérico"),
  body("feedback.comment").optional().isString().withMessage("Comentario debe ser texto"),
  body("feedback.instructorId").optional().isMongoId().withMessage("ID de instructor inválido"),
  body("status").optional().isIn(["in_progress", "completed", "abandoned"]).withMessage("Estado inválido"),
]

// Validaciones para consultas
const queryValidation = [
  query("apprenticeId").optional().isMongoId().withMessage("ID de aprendiz inválido"),
  query("courseId").optional().isMongoId().withMessage("ID de curso inválido"),
  query("level").optional().isInt({ min: 1, max: 6 }).withMessage("Nivel debe ser entre 1 y 6"),
  query("status").optional().isIn(["in_progress", "completed", "abandoned"]).withMessage("Estado inválido"),
  query("page").optional().isInt({ min: 1 }).withMessage("Página debe ser mayor a 0"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Límite debe ser entre 1 y 100"),
]

// Validaciones para parámetros
const paramValidation = [
  param("apprenticeId").isMongoId().withMessage("ID de aprendiz inválido"),
  param("level").isInt({ min: 1, max: 6 }).withMessage("Nivel debe ser entre 1 y 6"),
]

const courseParamValidation = [param("courseId").isMongoId().withMessage("ID de curso inválido")]

const idParamValidation = [param("id").isMongoId().withMessage("ID inválido")]

// Rutas principales
routeApprenticeProgress.post("/", createProgressValidation, createApprenticeProgress)
routeApprenticeProgress.get("/", queryValidation, getApprenticeProgress)
routeApprenticeProgress.get("/statistics", getProgressStatistics)

// Rutas específicas por aprendiz y nivel
routeApprenticeProgress.get("/apprentice/:apprenticeId/level/:level", paramValidation, getProgressByApprenticeAndLevel)

// Rutas específicas por curso/ficha
routeApprenticeProgress.get("/course/:courseId", courseParamValidation, getProgressByCourse)
routeApprenticeProgress.get("/course/:courseId/ranking", courseParamValidation, getFichaRanking)

// Rutas CRUD por ID
routeApprenticeProgress.get("/:id", idParamValidation, getProgressById)
routeApprenticeProgress.put("/:id", updateProgressValidation, updateApprenticeProgress)
routeApprenticeProgress.delete("/:id", idParamValidation, deleteApprenticeProgress)

export default routeApprenticeProgress
