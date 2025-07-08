import { body, param, query } from 'express-validator';

export const rankingValidators = {
  getStudentRanking: [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('El límite debe ser un número entre 1 y 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('El offset debe ser un número mayor o igual a 0'),
    query('programId')
      .optional()
      .isInt()
      .withMessage('El ID del programa debe ser un número válido'),
    query('courseId')
      .optional()
      .isInt()
      .withMessage('El ID del curso debe ser un número válido')
  ],

  getRankingMetrics: [
    query('programId')
      .optional()
      .isInt()
      .withMessage('El ID del programa debe ser un número válido'),
    query('courseId')
      .optional()
      .isInt()
      .withMessage('El ID del curso debe ser un número válido'),
    query('fichaId')
      .optional()
      .isString()
      .withMessage('El ID de la ficha debe ser una cadena válida')
  ],

  getStudentsByProgram: [
    param('programId')
      .isInt()
      .withMessage('El ID del programa debe ser un número válido'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('El límite debe ser un número entre 1 y 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('El offset debe ser un número mayor o igual a 0')
  ],

  getStudentsByCourse: [
    param('courseId')
      .isInt()
      .withMessage('El ID del curso debe ser un número válido'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('El límite debe ser un número entre 1 y 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('El offset debe ser un número mayor o igual a 0')
  ],

  getStudentRankingPosition: [
    param('studentId')
      .isInt()
      .withMessage('El ID del estudiante debe ser un número válido'),
    query('programId')
      .optional()
      .isInt()
      .withMessage('El ID del programa debe ser un número válido'),
    query('courseId')
      .optional()
      .isInt()
      .withMessage('El ID del curso debe ser un número válido')
  ],

  getFichaProgressStats: [
    param('fichaId')
      .isString()
      .notEmpty()
      .withMessage('El ID de la ficha es requerido y debe ser una cadena válida')
  ]
};