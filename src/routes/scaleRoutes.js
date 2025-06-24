// // // // // // // // const express = require("express")
// // // // // // // // const router = express.Router()
// // // // // // // // const scaleController = require("../controllers/scaleController")
// // // // // // // // const { validateScale, validateScaleUpdate, validateMetric } = require("../validators/scaleValidator")
// // // // // // // // const authMiddleware = require("../middlewares/authMiddleware")
// // // // // // // // const { validateRequest } = require("../middlewares/validationMiddleware")

// // // // // // // // // Aplicar middleware de autenticación a todas las rutas
// // // // // // // // router.use(authMiddleware)

// // // // // // // // // Rutas para escalas de valoración
// // // // // // // // router.get("/", scaleController.getAllScales)
// // // // // // // // router.get("/:id", scaleController.getScaleById)
// // // // // // // // router.post("/", validateScale, validateRequest, scaleController.createScale)
// // // // // // // // router.put("/:id", validateScaleUpdate, validateRequest, scaleController.updateScale)
// // // // // // // // router.delete("/:id", scaleController.deleteScale)

// // // // // // // // // Rutas para métricas
// // // // // // // // router.post("/:id/metrics", validateMetric, validateRequest, scaleController.addMetric)
// // // // // // // // router.put("/:id/metrics/:metricId", validateMetric, validateRequest, scaleController.updateMetric)
// // // // // // // // router.delete("/:id/metrics/:metricId", scaleController.deleteMetric)

// // // // // // // // module.exports = router
// // // // // // // const express = require("express")
// // // // // // // const router = express.Router()
// // // // // // // const scaleController = require("../controllers/scaleController")
// // // // // // // const { validateScale, validateScaleUpdate } = require("../validators/scaleValidator")
// // // // // // // const authMiddleware = require("../middlewares/authMiddleware")
// // // // // // // const { validateRequest } = require("../middlewares/validationMiddleware")

// // // // // // // // TEMPORAL: Comentar autenticación para probar conexión
// // // // // // // // router.use(authMiddleware)

// // // // // // // // Rutas para escalas de valoración
// // // // // // // router.get("/", scaleController.getAllScales)
// // // // // // // router.get("/:id", scaleController.getScaleById)
// // // // // // // router.post("/", validateScale, validateRequest, scaleController.createScale)
// // // // // // // router.put("/:id", validateScaleUpdate, validateRequest, scaleController.updateScale)
// // // // // // // router.delete("/:id", scaleController.deleteScale)

// // // // // // // module.exports = router
// // // // // // const express = require("express")
// // // // // // const router = express.Router()
// // // // // // const scaleController = require("../controllers/scaleController")
// // // // // // const { validateScale, validateScaleUpdate } = require("../validators/scaleValidator")
// // // // // // const { validateRequest } = require("../middlewares/validationMiddleware")

// // // // // // // Middleware temporal para simular autenticación (comentar cuando tengas auth real)
// // // // // // const tempAuthMiddleware = (req, res, next) => {
// // // // // //   // Simular usuario autenticado
// // // // // //   req.user = { id: "temp_user_id" }
// // // // // //   next()
// // // // // // }

// // // // // // // TEMPORAL: Comentar autenticación para probar conexión
// // // // // // // router.use(authMiddleware)

// // // // // // // Rutas para escalas de valoración
// // // // // // router.get("/", scaleController.getAllScales)
// // // // // // router.get("/:id", scaleController.getScaleById)
// // // // // // router.post("/", tempAuthMiddleware, validateScale, validateRequest, scaleController.createScale)
// // // // // // router.put("/:id", tempAuthMiddleware, validateScaleUpdate, validateRequest, scaleController.updateScale)
// // // // // // router.delete("/:id", tempAuthMiddleware, scaleController.deleteScale)

// // // // // // // Rutas para métricas
// // // // // // router.post("/:id/metrics", tempAuthMiddleware, scaleController.addMetric)
// // // // // // router.put("/:id/metrics/:metricId", tempAuthMiddleware, scaleController.updateMetric)
// // // // // // router.delete("/:id/metrics/:metricId", tempAuthMiddleware, scaleController.deleteMetric)

// // // // // // module.exports = router
// // // // // const express = require("express")
// // // // // const router = express.Router()
// // // // // const scaleController = require("../controllers/scaleController")
// // // // // const { validateScale, validateScaleUpdate, validateMetric } = require("../validators/scaleValidator")
// // // // // const { validateRequest } = require("../middlewares/validationMiddleware")

// // // // // // Middleware temporal de autenticación (reemplazar con authMiddleware real)
// // // // // const tempAuthMiddleware = (req, res, next) => {
// // // // //   req.user = { id: "temp_user_id" }
// // // // //   next()
// // // // // }

// // // // // // Rutas para escalas
// // // // // router.get("/", scaleController.getAllScales)
// // // // // router.get("/:id", scaleController.getScaleById)
// // // // // router.post("/", tempAuthMiddleware, validateScale, validateRequest, scaleController.createScale)
// // // // // router.put("/:id", tempAuthMiddleware, validateScaleUpdate, validateRequest, scaleController.updateScale)
// // // // // router.delete("/:id", tempAuthMiddleware, scaleController.deleteScale)

// // // // // // Rutas para métricas de escalas
// // // // // router.post("/:id/metrics", tempAuthMiddleware, validateMetric, validateRequest, scaleController.addMetric)
// // // // // router.put("/:id/metrics/:metricId", tempAuthMiddleware, validateMetric, validateRequest, scaleController.updateMetric)
// // // // // router.delete("/:id/metrics/:metricId", tempAuthMiddleware, scaleController.deleteMetric)

// // // // // module.exports = router
// // // // // src/routes/scaleRoutes.js
// // // // import { Router } from "express";
// // // // import {
// // // //   getScales,
// // // //   getScaleById,
// // // //   createScale,
// // // //   updateScale,
// // // //   deleteScale,
// // // //   getScaleStats,
// // // // } from "../controllers/scaleController.js";

// // // // const router = Router();

// // // // // Middleware de validación (opcional)
// // // // const validateScaleData = (req, res, next) => {
// // // //   const { fechaInicial, fechaFinal, rangoInicial, rangoFinal, apruebaPorcentaje } = req.body;

// // // //   if (req.method === "POST") {
// // // //     if (!fechaInicial || !fechaFinal) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Las fechas inicial y final son requeridas",
// // // //       });
// // // //     }

// // // //     if (rangoInicial === undefined || rangoFinal === undefined) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "Los rangos inicial y final son requeridos",
// // // //       });
// // // //     }

// // // //     if (apruebaPorcentaje === undefined) {
// // // //       return res.status(400).json({
// // // //         success: false,
// // // //         message: "El porcentaje de aprobación es requerido",
// // // //       });
// // // //     }
// // // //   }

// // // //   next();
// // // // };

// // // // // Rutas públicas
// // // // router.get("/stats", getScaleStats);
// // // // router.get("/", getScales);
// // // // router.get("/:id", getScaleById);

// // // // // Rutas protegidas
// // // // router.post("/", validateScaleData, createScale);
// // // // router.put("/:id", validateScaleData, updateScale);
// // // // router.delete("/:id", deleteScale);

// // // // console.log("✅ Rutas de escalas de valoración registradas");

// // // // export default router;
// // // import { Router } from "express"
// // // import {
// // //   getScales,
// // //   getScaleById,
// // //   createScale,
// // //   updateScale,
// // //   deleteScale,
// // //   getActiveScaleByDate,
// // //   evaluateScore,
// // //   getScaleStats,
// // // } from "../controllers/scaleController.js"
// // // import { validateRequest } from "../middlewares/validateRequest.js"
// // // import { body, param } from "express-validator"

// // // const router = Router()

// // // // Validaciones para crear escala
// // // const createScaleValidation = [
// // //   body("fechaInicial")
// // //     .notEmpty()
// // //     .withMessage("La fecha inicial es requerida")
// // //     .isISO8601()
// // //     .withMessage("La fecha inicial debe ser válida"),
// // //   body("fechaFinal")
// // //     .notEmpty()
// // //     .withMessage("La fecha final es requerida")
// // //     .isISO8601()
// // //     .withMessage("La fecha final debe ser válida")
// // //     .custom((value, { req }) => {
// // //       if (new Date(value) <= new Date(req.body.fechaInicial)) {
// // //         throw new Error("La fecha final debe ser posterior a la fecha inicial")
// // //       }
// // //       return true
// // //     }),
// // //   body("rangoInicial").isInt({ min: 0, max: 100 }).withMessage("El rango inicial debe ser un número entre 0 y 100"),
// // //   body("rangoFinal")
// // //     .isInt({ min: 0, max: 100 })
// // //     .withMessage("El rango final debe ser un número entre 0 y 100")
// // //     .custom((value, { req }) => {
// // //       if (Number.parseInt(value) <= Number.parseInt(req.body.rangoInicial)) {
// // //         throw new Error("El rango final debe ser mayor al rango inicial")
// // //       }
// // //       return true
// // //     }),
// // //   body("valoracion").isIn(["Aprueba", "No aprueba"]).withMessage('La valoración debe ser "Aprueba" o "No aprueba"'),
// // //   body("apruebaPorcentaje")
// // //     .optional()
// // //     .isInt({ min: 0, max: 100 })
// // //     .withMessage("El porcentaje de aprobación debe ser un número entre 0 y 100"),
// // //   body("descripcion")
// // //     .optional()
// // //     .isLength({ max: 1000 })
// // //     .withMessage("La descripción no puede exceder los 1000 caracteres"),
// // //   body("metricas").optional().isArray().withMessage("Las métricas deben ser un array"),
// // //   body("metricas.*.rangoInicial")
// // //     .optional()
// // //     .isInt({ min: 0, max: 100 })
// // //     .withMessage("El rango inicial de la métrica debe ser un número entre 0 y 100"),
// // //   body("metricas.*.rangoFinal")
// // //     .optional()
// // //     .isInt({ min: 0, max: 100 })
// // //     .withMessage("El rango final de la métrica debe ser un número entre 0 y 100"),
// // //   body("metricas.*.concepto")
// // //     .optional()
// // //     .notEmpty()
// // //     .withMessage("El concepto de la métrica es requerido")
// // //     .isLength({ max: 100 })
// // //     .withMessage("El concepto no puede exceder los 100 caracteres"),
// // // ]

// // // // Validaciones para actualizar escala
// // // const updateScaleValidation = [
// // //   param("id").isMongoId().withMessage("ID de escala inválido"),
// // //   ...createScaleValidation.map((validation) => validation.optional()),
// // // ]

// // // // Validaciones para parámetros
// // // const idValidation = [param("id").isMongoId().withMessage("ID de escala inválido")]

// // // // Validaciones para evaluación
// // // const evaluateScoreValidation = [
// // //   body("score").isNumeric().withMessage("La calificación debe ser un número"),
// // //   body("date").optional().isISO8601().withMessage("La fecha debe ser válida"),
// // // ]

// // // // Rutas principales
// // // router.get("/", getScales)
// // // router.get("/stats", getScaleStats)
// // // router.get("/active", getActiveScaleByDate)
// // // router.get("/:id", idValidation, validateRequest, getScaleById)
// // // router.post("/", createScaleValidation, validateRequest, createScale)
// // // router.put("/:id", updateScaleValidation, validateRequest, updateScale)
// // // router.delete("/:id", idValidation, validateRequest, deleteScale)
// // // router.post("/evaluate", evaluateScoreValidation, validateRequest, evaluateScore)

// // // export default router
// // import express from "express";
// // import { body, param } from "express-validator";
// // import {
// //   getScales,
// //   getScaleById,
// //   createScale,
// //   updateScale,
// //   deleteScale,
// //   getActiveScaleByDate,
// //   evaluateScore,
// //   getScaleStats,
// // } from "../controllers/scaleController.js";
// // import { validateRequest } from "../middlewares/validateRequest.js";

// // const router = express.Router();

// // // Validaciones para crear escala
// // const createScaleValidation = [
// //   body("fechaInicial")
// //     .notEmpty()
// //     .withMessage("La fecha inicial es requerida")
// //     .isISO8601()
// //     .withMessage("La fecha inicial debe ser válida"),
// //   body("fechaFinal")
// //     .notEmpty()
// //     .withMessage("La fecha final es requerida")
// //     .isISO8601()
// //     .withMessage("La fecha final debe ser válida")
// //     .custom((value, { req }) => {
// //       if (new Date(value) <= new Date(req.body.fechaInicial)) {
// //         throw new Error("La fecha final debe ser posterior a la fecha inicial");
// //       }
// //       return true;
// //     }),
// //   body("rangoInicial").isInt({ min: 0, max: 100 }).withMessage("El rango inicial debe ser un número entre 0 y 100"),
// //   body("rangoFinal")
// //     .isInt({ min: 0, max: 100 })
// //     .withMessage("El rango final debe ser un número entre 0 y 100")
// //     .custom((value, { req }) => {
// //       if (Number.parseInt(value) <= Number.parseInt(req.body.rangoInicial)) {
// //         throw new Error("El rango final debe ser mayor al rango inicial");
// //       }
// //       return true;
// //     }),
// //   body("valoracion").isIn(["Aprueba", "No aprueba"]).withMessage('La valoración debe ser "Aprueba" o "No aprueba"'),
// //   body("apruebaPorcentaje")
// //     .optional()
// //     .isInt({ min: 0, max: 100 })
// //     .withMessage("El porcentaje de aprobación debe ser un número entre 0 y 100"),
// //   body("descripcion")
// //     .optional()
// //     .isLength({ max: 1000 })
// //     .withMessage("La descripción no puede exceder los 1000 caracteres"),
// //   body("metricas").optional().isArray().withMessage("Las métricas deben ser un array"),
// //   body("metricas.*.rangoInicial")
// //     .optional()
// //     .isInt({ min: 0, max: 100 })
// //     .withMessage("El rango inicial de la métrica debe ser un número entre 0 y 100"),
// //   body("metricas.*.rangoFinal")
// //     .optional()
// //     .isInt({ min: 0, max: 100 })
// //     .withMessage("El rango final de la métrica debe ser un número entre 0 y 100"),
// //   body("metricas.*.concepto")
// //     .optional()
// //     .notEmpty()
// //     .withMessage("El concepto de la métrica es requerido")
// //     .isLength({ max: 100 })
// //     .withMessage("El concepto no puede exceder los 100 caracteres"),
// // ];

// // // Validaciones para actualizar escala
// // const updateScaleValidation = [
// //   param("id").isMongoId().withMessage("ID de escala inválido"),
// //   ...createScaleValidation.map((validation) => validation.optional()),
// // ];

// // // Validaciones para parámetros
// // const idValidation = [param("id").isMongoId().withMessage("ID de escala inválido")];

// // // Validaciones para evaluación
// // const evaluateScoreValidation = [
// //   body("score").isNumeric().withMessage("La calificación debe ser un número"),
// //   body("date").optional().isISO8601().withMessage("La fecha debe ser válida"),
// // ];

// // // Rutas principales
// // router.get("/", getScales);
// // router.get("/stats", getScaleStats);
// // router.get("/active", getActiveScaleByDate);
// // router.get("/:id", idValidation, validateRequest, getScaleById);
// // router.post("/", createScaleValidation, validateRequest, createScale);
// // router.put("/:id", updateScaleValidation, validateRequest, updateScale);
// // router.delete("/:id", idValidation, validateRequest, deleteScale);
// // router.post("/evaluate", evaluateScoreValidation, validateRequest, evaluateScore);

// // console.log("Rutas de escalas de valoración registradas");

// // export default router;
// import { Router } from "express"
// import {
//   getScales,
//   getScaleById,
//   createScale,
//   updateScale,
//   deleteScale,
//   getActiveScaleByDate,
//   evaluateScore,
//   getScaleStats,
// } from "../controllers/scaleController.js"
// import { validateRequest } from "../middlewares/validateRequest.js"
// import { body, param } from "express-validator"

// const router = Router()

// // Validaciones para crear escala
// const createScaleValidation = [
//   body("fechaInicial")
//     .notEmpty()
//     .withMessage("La fecha inicial es requerida")
//     .isISO8601()
//     .withMessage("La fecha inicial debe ser válida"),
//   body("fechaFinal")
//     .notEmpty()
//     .withMessage("La fecha final es requerida")
//     .isISO8601()
//     .withMessage("La fecha final debe ser válida")
//     .custom((value, { req }) => {
//       if (new Date(value) <= new Date(req.body.fechaInicial)) {
//         throw new Error("La fecha final debe ser posterior a la fecha inicial")
//       }
//       return true
//     }),
//   body("rangoInicial").isInt({ min: 0, max: 100 }).withMessage("El rango inicial debe ser un número entre 0 y 100"),
//   body("rangoFinal")
//     .isInt({ min: 0, max: 100 })
//     .withMessage("El rango final debe ser un número entre 0 y 100")
//     .custom((value, { req }) => {
//       if (Number.parseInt(value) <= Number.parseInt(req.body.rangoInicial)) {
//         throw new Error("El rango final debe ser mayor al rango inicial")
//       }
//       return true
//     }),
//   body("valoracion").isIn(["Aprueba", "No aprueba"]).withMessage('La valoración debe ser "Aprueba" o "No aprueba"'),
//   body("apruebaPorcentaje")
//     .optional()
//     .isInt({ min: 0, max: 100 })
//     .withMessage("El porcentaje de aprobación debe ser un número entre 0 y 100"),
//   body("descripcion")
//     .optional()
//     .isLength({ max: 1000 })
//     .withMessage("La descripción no puede exceder los 1000 caracteres"),
//   body("metricas").optional().isArray().withMessage("Las métricas deben ser un array"),
//   body("metricas.*.rangoInicial")
//     .optional()
//     .isInt({ min: 0, max: 100 })
//     .withMessage("El rango inicial de la métrica debe ser un número entre 0 y 100"),
//   body("metricas.*.rangoFinal")
//     .optional()
//     .isInt({ min: 0, max: 100 })
//     .withMessage("El rango final de la métrica debe ser un número entre 0 y 100"),
//   body("metricas.*.concepto")
//     .optional()
//     .notEmpty()
//     .withMessage("El concepto de la métrica es requerido")
//     .isLength({ max: 100 })
//     .withMessage("El concepto no puede exceder los 100 caracteres"),
// ]

// // Validaciones para actualizar escala
// const updateScaleValidation = [
//   param("id").isMongoId().withMessage("ID de escala inválido"),
//   ...createScaleValidation.map((validation) => validation.optional()),
// ]

// // Validaciones para parámetros
// const idValidation = [param("id").isMongoId().withMessage("ID de escala inválido")]

// // Validaciones para evaluación
// const evaluateScoreValidation = [
//   body("score").isNumeric().withMessage("La calificación debe ser un número"),
//   body("date").optional().isISO8601().withMessage("La fecha debe ser válida"),
// ]

// // Rutas principales
// router.get("/", getScales)
// router.get("/stats", getScaleStats)
// router.get("/active", getActiveScaleByDate)
// router.get("/:id", idValidation, validateRequest, getScaleById)
// router.post("/", createScaleValidation, validateRequest, createScale)
// router.put("/:id", updateScaleValidation, validateRequest, updateScale)
// router.delete("/:id", idValidation, validateRequest, deleteScale)
// router.post("/evaluate", evaluateScoreValidation, validateRequest, evaluateScore)

// export default router
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
