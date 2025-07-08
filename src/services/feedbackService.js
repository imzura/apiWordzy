const Feedback = require('../models/feedback');
const Apprentice = require('../models/apprentice');
const Instructor = require('../models/instructor');
const Course = require('../models/course');
const { Op } = require('sequelize');

class FeedbackService {
  // Obtener todos los feedbacks con filtros y paginación
  async getAllFeedbacks(filters) {
    try {
      const whereClause = {};
      const includeClause = [
        {
          model: Apprentice,
          as: 'apprentice',
          attributes: ['id', 'firstName', 'lastName', 'documentNumber']
        },
        {
          model: Instructor,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name', 'code']
        }
      ];

      // Aplicar filtros
      if (filters.fichaCode) {
        includeClause[2].where = {
          code: filters.fichaCode
        };
      }

      if (filters.level) {
        whereClause.level = filters.level;
      }

      if (filters.instructorId) {
        whereClause.instructorId = filters.instructorId;
      }

      if (filters.feedbackType) {
        whereClause.feedbackType = filters.feedbackType;
      }

      if (filters.category) {
        whereClause.category = filters.category;
      }

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.priority) {
        whereClause.priority = filters.priority;
      }

      const offset = (filters.page - 1) * filters.limit;

      const { count, rows } = await Feedback.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: filters.limit,
        offset: offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        feedbacks: rows,
        pagination: {
          total: count,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(count / filters.limit)
        }
      };
    } catch (error) {
      console.error('Error en getAllFeedbacks:', error);
      throw error;
    }
  }

  // Obtener feedback por ID
  async getFeedbackById(id) {
    try {
      const feedback = await Feedback.findByPk(id, {
        include: [
          {
            model: Apprentice,
            as: 'apprentice',
            attributes: ['id', 'firstName', 'lastName', 'documentNumber', 'email']
          },
          {
            model: Instructor,
            as: 'instructor',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'code', 'description']
          }
        ]
      });

      return feedback;
    } catch (error) {
      console.error('Error en getFeedbackById:', error);
      throw error;
    }
  }

  // Crear nuevo feedback
  async createFeedback(feedbackData) {
    try {
      const newFeedback = await Feedback.create(feedbackData);
      
      // Obtener el feedback completo con las relaciones
      const completeFeedback = await this.getFeedbackById(newFeedback.id);
      
      return completeFeedback;
    } catch (error) {
      console.error('Error en createFeedback:', error);
      throw error;
    }
  }

  // Actualizar feedback
  async updateFeedback(id, updateData) {
    try {
      const [updatedRowsCount] = await Feedback.update(updateData, {
        where: { id }
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      const updatedFeedback = await this.getFeedbackById(id);
      return updatedFeedback;
    } catch (error) {
      console.error('Error en updateFeedback:', error);
      throw error;
    }
  }

  // Eliminar feedback
  async deleteFeedback(id) {
    try {
      const deletedRowsCount = await Feedback.destroy({
        where: { id }
      });

      return deletedRowsCount > 0;
    } catch (error) {
      console.error('Error en deleteFeedback:', error);
      throw error;
    }
  }

  // Obtener estadísticas de feedback
  async getFeedbackStats(filters) {
    try {
      const whereClause = {};
      const includeClause = [];

      // Aplicar filtros
      if (filters.fichaCode) {
        includeClause.push({
          model: Course,
          as: 'course',
          where: { code: filters.fichaCode },
          attributes: []
        });
      }

      if (filters.level) {
        whereClause.level = filters.level;
      }

      if (filters.instructorId) {
        whereClause.instructorId = filters.instructorId;
      }

      // Estadísticas por tipo
      const typeStats = await Feedback.findAll({
        where: whereClause,
        include: includeClause,
        attributes: [
          'feedbackType',
          [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('id')), 'count']
        ],
        group: ['feedbackType']
      });

      // Estadísticas por categoría
      const categoryStats = await Feedback.findAll({
        where: whereClause,
        include: includeClause,
        attributes: [
          'category',
          [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('id')), 'count']
        ],
        group: ['category']
      });

      // Estadísticas por prioridad
      const priorityStats = await Feedback.findAll({
        where: whereClause,
        include: includeClause,
        attributes: [
          'priority',
          [Feedback.sequelize.fn('COUNT', Feedback.sequelize.col('id')), 'count']
        ],
        group: ['priority']
      });

      // Total de feedbacks
      const totalFeedbacks = await Feedback.count({
        where: whereClause,
        include: includeClause
      });

      return {
        total: totalFeedbacks,
        byType: typeStats,
        byCategory: categoryStats,
        byPriority: priorityStats
      };
    } catch (error) {
      console.error('Error en getFeedbackStats:', error);
      throw error;
    }
  }

  // Obtener detalles de estudiante
  async getStudentDetails(apprenticeId) {
    try {
      const apprentice = await Apprentice.findByPk(apprenticeId, {
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      if (!apprentice) {
        return null;
      }

      // Obtener feedbacks del estudiante
      const feedbacks = await Feedback.findAll({
        where: { apprenticeId },
        include: [
          {
            model: Instructor,
            as: 'instructor',
            attributes: ['firstName', 'lastName']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      // Estadísticas del estudiante
      const feedbackStats = await this.getFeedbackStats({ apprenticeId });

      return {
        student: apprentice,
        recentFeedbacks: feedbacks,
        stats: feedbackStats
      };
    } catch (error) {
      console.error('Error en getStudentDetails:', error);
      throw error;
    }
  }
}

module.exports = new FeedbackService();