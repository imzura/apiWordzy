const feedbackService = require('../services/feedbackService');
const { validationResult } = require('express-validator');
const { responseHandler } = require('../utils/responseHandler');

class FeedbackController {
  // Obtener todos los feedbacks con filtros
  async getAllFeedbacks(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responseHandler.error(res, 'Errores de validación', 400, errors.array());
      }

      const filters = {
        fichaCode: req.query.ficha,
        level: req.query.nivel,
        instructorId: req.query.instructor,
        feedbackType: req.query.tipo,
        category: req.query.categoria,
        status: req.query.estado,
        priority: req.query.prioridad,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
      };

      const result = await feedbackService.getAllFeedbacks(filters);
      return responseHandler.success(res, 'Feedbacks obtenidos exitosamente', result);
    } catch (error) {
      console.error('Error al obtener feedbacks:', error);
      return responseHandler.error(res, 'Error interno del servidor', 500);
    }
  }

  // Obtener feedback por ID
  async getFeedbackById(req, res) {
    try {
      const { id } = req.params;
      const feedback = await feedbackService.getFeedbackById(id);
      
      if (!feedback) {
        return responseHandler.error(res, 'Feedback no encontrado', 404);
      }

      return responseHandler.success(res, 'Feedback obtenido exitosamente', feedback);
    } catch (error) {
      console.error('Error al obtener feedback:', error);
      return responseHandler.error(res, 'Error interno del servidor', 500);
    }
  }

  // Crear nuevo feedback
  async createFeedback(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responseHandler.error(res, 'Errores de validación', 400, errors.array());
      }

      const feedbackData = req.body;
      const newFeedback = await feedbackService.createFeedback(feedbackData);
      
      return responseHandler.success(res, 'Feedback creado exitosamente', newFeedback, 201);
    } catch (error) {
      console.error('Error al crear feedback:', error);
      return responseHandler.error(res, 'Error interno del servidor', 500);
    }
  }

  // Actualizar feedback
  async updateFeedback(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responseHandler.error(res, 'Errores de validación', 400, errors.array());
      }

      const { id } = req.params;
      const updateData = req.body;
      
      const updatedFeedback = await feedbackService.updateFeedback(id, updateData);
      
      if (!updatedFeedback) {
        return responseHandler.error(res, 'Feedback no encontrado', 404);
      }

      return responseHandler.success(res, 'Feedback actualizado exitosamente', updatedFeedback);
    } catch (error) {
      console.error('Error al actualizar feedback:', error);
      return responseHandler.error(res, 'Error interno del servidor', 500);
    }
  }

  // Eliminar feedback
  async deleteFeedback(req, res) {
    try {
      const { id } = req.params;
      const deleted = await feedbackService.deleteFeedback(id);
      
      if (!deleted) {
        return responseHandler.error(res, 'Feedback no encontrado', 404);
      }

      return responseHandler.success(res, 'Feedback eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar feedback:', error);
      return responseHandler.error(res, 'Error interno del servidor', 500);
    }
  }

  // Obtener estadísticas de feedback
  async getFeedbackStats(req, res) {
    try {
      const filters = {
        fichaCode: req.query.ficha,
        level: req.query.nivel,
        instructorId: req.query.instructor
      };

      const stats = await feedbackService.getFeedbackStats(filters);
      return responseHandler.success(res, 'Estadísticas obtenidas exitosamente', stats);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return responseHandler.error(res, 'Error interno del servidor', 500);
    }
  }

  // Obtener detalles de estudiante
  async getStudentDetails(req, res) {
    try {
      const { apprenticeId } = req.params;
      const details = await feedbackService.getStudentDetails(apprenticeId);
      
      if (!details) {
        return responseHandler.error(res, 'Estudiante no encontrado', 404);
      }

      return responseHandler.success(res, 'Detalles del estudiante obtenidos exitosamente', details);
    } catch (error) {
      console.error('Error al obtener detalles del estudiante:', error);
      return responseHandler.error(res, 'Error interno del servidor', 500);
    }
  }
}

module.exports = new FeedbackController();