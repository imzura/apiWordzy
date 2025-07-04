const Apprentice = require('../models/apprentice');
const Instructor = require('../models/instructor');
const Course = require('../models/course');
const { responseHandler } = require('../utils/responseHandler');

const validateFeedback = {
  // Validar datos para crear feedback
  async validateCreate(req, res, next) {
    try {
      const { apprenticeId, instructorId, courseId } = req.body;

      // Verificar que el aprendiz existe
      const apprentice = await Apprentice.findByPk(apprenticeId);
      if (!apprentice) {
        return responseHandler.error(res, 'El aprendiz especificado no existe', 400);
      }

      // Verificar que el instructor existe
      const instructor = await Instructor.findByPk(instructorId);
      if (!instructor) {
        return responseHandler.error(res, 'El instructor especificado no existe', 400);
      }

      // Verificar que el curso existe
      const course = await Course.findByPk(courseId);
      if (!course) {
        return responseHandler.error(res, 'El curso especificado no existe', 400);
      }

      // Verificar que el aprendiz pertenece al curso
      if (apprentice.courseId !== courseId) {
        return responseHandler.error(res, 'El aprendiz no pertenece al curso especificado', 400);
      }

      next();
    } catch (error) {
      console.error('Error en validateCreate:', error);
      return responseHandler.error(res, 'Error interno del servidor', 500);
    }
  },

  // Validar datos para actualizar feedback
  async validateUpdate(req, res, next) {
    try {
      const { id } = req.params;
      const { apprenticeId, instructorId, courseId } = req.body;

      // Verificar que el feedback existe
      const Feedback = require('../models/feedback');
      const feedback = await Feedback.findByPk(id);
      if (!feedback) {
        return responseHandler.error(res, 'El feedback especificado no existe', 404);
      }

      // Si se está actualizando el apprenticeId, verificar que existe
      if (apprenticeId) {
        const apprentice = await Apprentice.findByPk(apprenticeId);
        if (!apprentice) {
          return responseHandler.error(res, 'El aprendiz especificado no existe', 400);
        }
      }

      // Si se está actualizando el instructorId, verificar que existe
      if (instructorId) {
        const instructor = await Instructor.findByPk(instructorId);
        if (!instructor) {
          return responseHandler.error(res, 'El instructor especificado no existe', 400);
        }
      }

      // Si se está actualizando el courseId, verificar que existe
      if (courseId) {
        const course = await Course.findByPk(courseId);
        if (!course) {
          return responseHandler.error(res, 'El curso especificado no existe', 400);
        }
      }

      next();
    } catch (error) {
      console.error('Error en validateUpdate:', error);
      return responseHandler.error(res, 'Error interno del servidor', 500);
    }
  }
};

module.exports = validateFeedback;