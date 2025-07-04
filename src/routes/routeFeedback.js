import express from 'express';
import feedbackController from '../controllers/feedbackController.js';
import { feedbackValidation } from '../validators/feedbackValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateFeedback from '../middlewares/validateFeedback.js';

const router = express.Router();

// Ruta para crear un nuevo feedback
router.post('/feedback', authMiddleware, feedbackValidation, validateFeedback, feedbackController.createFeedback);

// Ruta para obtener todos los feedbacks
router.get('/feedback', authMiddleware, feedbackController.getAllFeedbacks);

// Ruta para obtener un feedback por su ID
router.get('/feedback/:id', authMiddleware, feedbackController.getFeedbackById);

// Ruta para actualizar un feedback por su ID
router.put('/feedback/:id', authMiddleware, feedbackValidation, validateFeedback, feedbackController.updateFeedback);

// Ruta para eliminar un feedback por su ID
router.delete('/feedback/:id', authMiddleware, feedbackController.deleteFeedback);

export default router;