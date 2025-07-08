import { Apprentice, Course, Program, ApprenticeProgress, Evaluation } from '../models/index.js';
import { Op, Sequelize } from 'sequelize';

const rankingService = {
  // Obtener ranking de estudiantes
  getStudentRanking: async ({ limit, offset, programId, courseId }) => {
    const whereClause = {};
    const includeClause = [
      {
        model: Program,
        as: 'program',
        attributes: ['id', 'name']
      }
    ];

    if (programId) {
      whereClause.programId = programId;
    }

    if (courseId) {
      includeClause.push({
        model: Course,
        as: 'courses',
        where: { id: courseId },
        attributes: ['id', 'name']
      });
    }

    const students = await Apprentice.findAll({
      where: whereClause,
      include: [
        ...includeClause,
        {
          model: ApprenticeProgress,
          as: 'progress',
          attributes: ['totalPoints', 'completedActivities', 'averageScore']
        },
        {
          model: Evaluation,
          as: 'evaluations',
          attributes: ['score', 'createdAt']
        }
      ],
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'ficha',
        [Sequelize.fn('COALESCE', Sequelize.col('progress.totalPoints'), 0), 'totalPoints'],
        [Sequelize.fn('COALESCE', Sequelize.col('progress.completedActivities'), 0), 'completedActivities'],
        [Sequelize.fn('COALESCE', Sequelize.col('progress.averageScore'), 0), 'averageScore']
      ],
      order: [
        [Sequelize.col('totalPoints'), 'DESC'],
        [Sequelize.col('averageScore'), 'DESC']
      ],
      limit,
      offset,
      subQuery: false
    });

    // Calcular posición en el ranking
    const studentsWithRank = students.map((student, index) => ({
      ...student.toJSON(),
      rank: offset + index + 1
    }));

    const totalCount = await Apprentice.count({ where: whereClause });

    return {
      students: studentsWithRank,
      totalCount,
      hasMore: offset + limit < totalCount
    };
  },

  // Obtener métricas de ranking
  getRankingMetrics: async ({ programId, courseId, fichaId }) => {
    const whereClause = {};
    
    if (programId) whereClause.programId = programId;
    if (fichaId) whereClause.ficha = fichaId;

    const totalStudents = await Apprentice.count({ where: whereClause });
    
    const avgPoints = await ApprenticeProgress.findOne({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('totalPoints')), 'avgPoints'],
        [Sequelize.fn('MAX', Sequelize.col('totalPoints')), 'maxPoints'],
        [Sequelize.fn('MIN', Sequelize.col('totalPoints')), 'minPoints']
      ],
      include: [{
        model: Apprentice,
        as: 'apprentice',
        where: whereClause,
        attributes: []
      }],
      raw: true
    });

    const topPerformers = await Apprentice.findAll({
      where: whereClause,
      include: [{
        model: ApprenticeProgress,
        as: 'progress',
        attributes: ['totalPoints', 'averageScore']
      }],
      attributes: ['id', 'firstName', 'lastName'],
      order: [[Sequelize.col('progress.totalPoints'), 'DESC']],
      limit: 3
    });

    return {
      totalStudents,
      averagePoints: Math.round(avgPoints?.avgPoints || 0),
      maxPoints: avgPoints?.maxPoints || 0,
      minPoints: avgPoints?.minPoints || 0,
      topPerformers: topPerformers.map(student => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        points: student.progress?.totalPoints || 0,
        averageScore: student.progress?.averageScore || 0
      }))
    };
  },

  // Obtener estudiantes por programa
  getStudentsByProgram: async (programId, { limit, offset }) => {
    const students = await Apprentice.findAll({
      where: { programId },
      include: [
        {
          model: Program,
          as: 'program',
          attributes: ['id', 'name']
        },
        {
          model: ApprenticeProgress,
          as: 'progress',
          attributes: ['totalPoints', 'completedActivities', 'averageScore']
        }
      ],
      attributes: ['id', 'firstName', 'lastName', 'email', 'ficha'],
      order: [['firstName', 'ASC']],
      limit,
      offset
    });

    const totalCount = await Apprentice.count({ where: { programId } });

    return {
      students: students.map(student => ({
        ...student.toJSON(),
        totalPoints: student.progress?.totalPoints || 0,
        completedActivities: student.progress?.completedActivities || 0,
        averageScore: student.progress?.averageScore || 0
      })),
      totalCount,
      hasMore: offset + limit < totalCount
    };
  },

  // Obtener estudiantes por curso
  getStudentsByCourse: async (courseId, { limit, offset }) => {
    const students = await Apprentice.findAll({
      include: [
        {
          model: Course,
          as: 'courses',
          where: { id: courseId },
          attributes: ['id', 'name']
        },
        {
          model: ApprenticeProgress,
          as: 'progress',
          attributes: ['totalPoints', 'completedActivities', 'averageScore']
        }
      ],
      attributes: ['id', 'firstName', 'lastName', 'email', 'ficha'],
      order: [['firstName', 'ASC']],
      limit,
      offset
    });

    const totalCount = await Apprentice.count({
      include: [{
        model: Course,
        as: 'courses',
        where: { id: courseId }
      }]
    });

    return {
      students: students.map(student => ({
        ...student.toJSON(),
        totalPoints: student.progress?.totalPoints || 0,
        completedActivities: student.progress?.completedActivities || 0,
        averageScore: student.progress?.averageScore || 0
      })),
      totalCount,
      hasMore: offset + limit < totalCount
    };
  },

  // Obtener posición de un estudiante en el ranking
  getStudentRankingPosition: async (studentId, { programId, courseId }) => {
    const student = await Apprentice.findByPk(studentId, {
      include: [{
        model: ApprenticeProgress,
        as: 'progress',
        attributes: ['totalPoints', 'averageScore']
      }]
    });

    if (!student) {
      throw new Error('Estudiante no encontrado');
    }

    const studentPoints = student.progress?.totalPoints || 0;
    
    const whereClause = {};
    if (programId) whereClause.programId = programId;

    const betterStudentsCount = await Apprentice.count({
      where: whereClause,
      include: [{
        model: ApprenticeProgress,
        as: 'progress',
        where: {
          totalPoints: { [Op.gt]: studentPoints }
        }
      }]
    });

    return {
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        points: studentPoints,
        averageScore: student.progress?.averageScore || 0
      },
      rank: betterStudentsCount + 1,
      totalStudents: await Apprentice.count({ where: whereClause })
    };
  },

  // Obtener estadísticas de progreso por ficha
  getFichaProgressStats: async (fichaId) => {
    const students = await Apprentice.findAll({
      where: { ficha: fichaId },
      include: [{
        model: ApprenticeProgress,
        as: 'progress',
        attributes: ['totalPoints', 'completedActivities', 'averageScore']
      }],
      attributes: ['id', 'firstName', 'lastName']
    });

    const totalStudents = students.length;
    const totalPoints = students.reduce((sum, student) => 
      sum + (student.progress?.totalPoints || 0), 0);
    const avgPoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;

    const completedActivities = students.reduce((sum, student) => 
      sum + (student.progress?.completedActivities || 0), 0);
    const avgActivities = totalStudents > 0 ? Math.round(completedActivities / totalStudents) : 0;

    return {
      fichaId,
      totalStudents,
      averagePoints: avgPoints,
      totalPoints,
      averageCompletedActivities: avgActivities,
      students: students.map(student => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        points: student.progress?.totalPoints || 0,
        completedActivities: student.progress?.completedActivities || 0,
        averageScore: student.progress?.averageScore || 0
      }))
    };
  }
};

export default rankingService;