
import express from "express"
import { body, param } from "express-validator"
import {
  getScales,
  getScaleById,
  createScale,
  updateScale,
  deleteScale,
  getActiveScaleByDate,
  evaluateScore,
  getScaleStats,
} from "../controllers/scaleController.js"
import { validateRequest } from "../middlewares/validateRequest1.js"

const router = express.Router()

// Validaciones para crear escala
const createScaleValidation = [
  body("fechaInicial")
    .notEmpty()
    .withMessage("La fecha inicial es requerida")
    .isISO8601()
    .withMessage("La fecha inicial debe ser válida"),
  body("fechaFinal")
    .notEmpty()
    .withMessage("La fecha final es requerida")
    .isISO8601()
    .withMessage("La fecha final debe ser válida")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.fechaInicial)) {
        throw new Error("La fecha final debe ser posterior o igual a la fecha inicial")
      }
      return true
    }),
  body("apruebaPorcentaje")
    .notEmpty()
    .withMessage("El porcentaje de aprobación es requerido")
    .isInt({ min: 0, max: 100 })
    .withMessage("El porcentaje de aprobación debe ser un número entre 0 y 100"),
  body("descripcion")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede exceder los 1000 caracteres"),
  body("metricas").optional().isArray().withMessage("Las métricas deben ser un array"),
  body("metricas.*.rangoInicial")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("El rango inicial de la métrica debe ser un número entre 0 y 100"),
  body("metricas.*.rangoFinal")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("El rango final de la métrica debe ser un número entre 0 y 100"),
  body("metricas.*.concepto")
    .optional()
    .notEmpty()
    .withMessage("El concepto de la métrica es requerido")
    .isLength({ max: 100 })
    .withMessage("El concepto no puede exceder los 100 caracteres"),
]

// Validaciones para actualizar escala
const updateScaleValidation = [
  param("id").isMongoId().withMessage("ID de escala inválido"),
  ...createScaleValidation.map((validation) => validation.optional()),
]

// Validaciones para parámetros
const idValidation = [param("id").isMongoId().withMessage("ID de escala inválido")]

// Validaciones para evaluación
const evaluateScoreValidation = [
  body("score").isNumeric().withMessage("La calificación debe ser un número"),
  body("date").optional().isISO8601().withMessage("La fecha debe ser válida"),
]

// Rutas principales
router.get("/", getScales)
router.get("/stats", getScaleStats)
router.get("/active", getActiveScaleByDate)
router.get("/:id", idValidation, validateRequest, getScaleById)
router.post("/", createScaleValidation, validateRequest, createScale)
router.put("/:id", updateScaleValidation, validateRequest, updateScale)
router.delete("/:id", idValidation, validateRequest, deleteScale)
router.post("/evaluate", evaluateScoreValidation, validateRequest, evaluateScore)

console.log("Rutas de escalas de valoración registradas")

export default router
