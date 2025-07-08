import rankingService from '../services/rankingService.js';
import { handleResponse, handleError } from '../utils/responseHandler.js';

const rankingController = {
  // Obtener ranking general de estudiantes
  getStudentRanking: async (req, res) => {
    try {
      const { limit = 10, offset = 0, programId, courseId } = req.query;
      
      const ranking = await rankingService.getStudentRanking({
        limit: parseInt(limit),
        offset: parseInt(offset),
        programId,
        courseId
      });
      
      handleResponse(res, 200, 'Ranking obtenido exitosamente', ranking);
    } catch (error) {
      handleError(res, error);
    }
  },

  // Obtener métricas de ranking
  getRankingMetrics: async (req, res) => {
    try {
      const { programId, courseId, fichaId } = req.query;
      
      const metrics = await rankingService.getRankingMetrics({
        programId,
        courseId,
        fichaId
      });
      
      handleResponse(res, 200, 'Métricas obtenidas exitosamente', metrics);
    } catch (error) {
      handleError(res, error);
    }
  },

  // Obtener estudiantes por programa
  getStudentsByProgram: async (req, res) => {
    try {
      const { programId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      const students = await rankingService.getStudentsByProgram(programId, {
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      handleResponse(res, 200, 'Estudiantes por programa obtenidos exitosamente', students);
    } catch (error) {
      handleError(res, error);
    }
  },

  // Obtener estudiantes por curso
  getStudentsByCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      const students = await rankingService.getStudentsByCourse(courseId, {
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      handleResponse(res, 200, 'Estudiantes por curso obtenidos exitosamente', students);
    } catch (error) {
      handleError(res, error);
    }
  },

  // Obtener ranking de un estudiante específico
  getStudentRankingPosition: async (req, res) => {
    try {
      const { studentId } = req.params;
      const { programId, courseId } = req.query;
      
      const position = await rankingService.getStudentRankingPosition(studentId, {
        programId,
        courseId
      });
      
      handleResponse(res, 200, 'Posición en ranking obtenida exitosamente', position);
    } catch (error) {
      handleError(res, error);
    }
  },

  // Obtener estadísticas de progreso por ficha
  getFichaProgressStats: async (req, res) => {
    try {
      const { fichaId } = req.params;
      
      const stats = await rankingService.getFichaProgressStats(fichaId);
      
      handleResponse(res, 200, 'Estadísticas de ficha obtenidas exitosamente', stats);
    } catch (error) {
      handleError(res, error);
    }
  }
};

export default rankingController;