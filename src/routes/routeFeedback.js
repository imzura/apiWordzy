const express = require("express")
const feedbackController = require("../controllers/feedbackController")
const {
  feedbackValidation,
  feedbackFilterValidation,
  feedbackIdValidation,
  apprenticeIdValidation,
} = require("../validators/feedbackValidator")
const authMiddleware = require("../middlewares/authMiddleware")
const validateFeedback = require("../middlewares/validateFeedback")

const router = express.Router()

// Ruta para obtener todos los feedbacks con filtros
router.get("/feedback", authMiddleware, feedbackFilterValidation, feedbackController.getAllFeedbacks)

// Ruta para obtener estadísticas de feedback
router.get("/feedback/stats", authMiddleware, feedbackFilterValidation, feedbackController.getFeedbackStats)

// Ruta para obtener detalles de un estudiante específico
router.get(
  "/student/:apprenticeId/details",
  authMiddleware,
  apprenticeIdValidation,
  feedbackController.getStudentDetails,
)

// Ruta para obtener un feedback por su ID
router.get("/feedback/:id", authMiddleware, feedbackIdValidation, feedbackController.getFeedbackById)

// Ruta para crear un nuevo feedback
router.post("/feedback", authMiddleware, feedbackValidation, validateFeedback, feedbackController.createFeedback)

// Ruta para actualizar un feedback por su ID
router.put(
  "/feedback/:id",
  authMiddleware,
  feedbackIdValidation,
  feedbackValidation,
  validateFeedback,
  feedbackController.updateFeedback,
)

// Ruta para eliminar un feedback por su ID
router.delete("/feedback/:id", authMiddleware, feedbackIdValidation, feedbackController.deleteFeedback)

module.exports = router
