const { body, param, query } = require('express-validator');

const feedbackValidation = {
  // Validaciones para obtener todos los feedbacks
  getAll: [
    query('ficha')
      .optional()
      .isString()
      .withMessage('El código de ficha debe ser una cadena de texto'),
    
    query('nivel')
      .optional()
      .isString()
      .withMessage('El nivel debe ser una cadena de texto'),
    
    query('instructor')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del instructor debe ser un número entero positivo'),
    
    query('tipo')
      .optional()
      .isIn(['positivo', 'constructivo', 'neutral'])
      .withMessage('El tipo debe ser: positivo, constructivo o neutral'),
    
    query('categoria')
      .optional()
      .isIn(['tecnico', 'actitudinal', 'participacion', 'puntualidad', 'trabajo_equipo'])
      .withMessage('La categoría debe ser: tecnico, actitudinal, participacion, puntualidad o trabajo_equipo'),
    
    query('estado')
      .optional()
      .isIn(['pendiente', 'revisado', 'resuelto'])
      .withMessage('El estado debe ser: pendiente, revisado o resuelto'),
    
    query('prioridad')
      .optional()
      .isIn(['baja', 'media', 'alta'])
      .withMessage('La prioridad debe ser: baja, media o alta'),
    
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La página debe ser un número entero positivo'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('El límite debe ser un número entre 1 y 100')
  ],

  // Validaciones para obtener feedback por ID
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo')
  ],

  // Validaciones para crear feedback
  create: [
    body('apprenticeId')
      .notEmpty()
      .withMessage('El ID del aprendiz es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del aprendiz debe ser un número entero positivo'),
    
    body('instructorId')
      .notEmpty()
      .withMessage('El ID del instructor es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del instructor debe ser un número entero positivo'),
    
    body('courseId')
      .notEmpty()
      .withMessage('El ID del curso es requerido')
      .isInt({ min: 1 })
      .withMessage('El ID del curso debe ser un número entero positivo'),
    
    body('level')
      .notEmpty()
      .withMessage('El nivel es requerido')
      .isString()
      .isLength({ min: 1, max: 50 })
      .withMessage('El nivel debe tener entre 1 y 50 caracteres'),
    
    body('feedbackType')
      .notEmpty()
      .withMessage('El tipo de feedback es requerido')
      .isIn(['positivo', 'constructivo', 'neutral'])
      .withMessage('El tipo debe ser: positivo, constructivo o neutral'),
    
    body('category')
      .notEmpty()
      .withMessage('La categoría es requerida')
      .isIn(['tecnico', 'actitudinal', 'participacion', 'puntualidad', 'trabajo_equipo'])
      .withMessage('La categoría debe ser: tecnico, actitudinal, participacion, puntualidad o trabajo_equipo'),
    
    body('title')
      .notEmpty()
      .withMessage('El título es requerido')
      .isString()
      .isLength({ min: 5, max: 200 })
      .withMessage('El título debe tener entre 5 y 200 caracteres'),
    
    body('description')
      .notEmpty()
      .withMessage('La descripción es requerida')
      .isString()
      .isLength({ min: 10 })
      .withMessage('La descripción debe tener al menos 10 caracteres'),
    
    body('recommendations')
      .optional()
      .isString()
      .withMessage('Las recomendaciones deben ser una cadena de texto'),
    
    body('priority')
      .optional()
      .isIn(['baja', 'media', 'alta'])
      .withMessage('La prioridad debe ser: baja, media o alta'),
    
    body('isPrivate')
      .optional()
      .isBoolean()
      .withMessage('isPrivate debe ser un valor booleano')
  ],

  // Validaciones para actualizar feedback
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo'),
    
    body('level')
      .optional()
      .isString()
      .isLength({ min: 1, max: 50 })
      .withMessage('El nivel debe tener entre 1 y 50 caracteres'),
    
    body('feedbackType')
      .optional()
      .isIn(['positivo', 'constructivo', 'neutral'])
      .withMessage('El tipo debe ser: positivo, constructivo o neutral'),
    
    body('category')
      .optional()
      .isIn(['tecnico', 'actitudinal', 'participacion', 'puntualidad', 'trabajo_equipo'])
      .withMessage('La categoría debe ser: tecnico, actitudinal, participacion, puntualidad o trabajo_equipo'),
    
    body('title')
      .optional()
      .isString()
      .isLength({ min: 5, max: 200 })
      .withMessage('El título debe tener entre 5 y 200 caracteres'),
    
    body('description')
      .optional()
      .isString()
      .isLength({ min: 10 })
      .withMessage('La descripción debe tener al menos 10 caracteres'),
    
    body('recommendations')
      .optional()
      .isString()
      .withMessage('Las recomendaciones deben ser una cadena de texto'),
    
    body('priority')
      .optional()
      .isIn(['baja', 'media', 'alta'])
      .withMessage('La prioridad debe ser: baja, media o alta'),
    
    body('status')
      .optional()
      .isIn(['pendiente', 'revisado', 'resuelto'])
      .withMessage('El estado debe ser: pendiente, revisado o resuelto'),
    
    body('isPrivate')
      .optional()
      .isBoolean()
      .withMessage('isPrivate debe ser un valor booleano')
  ],

  // Validaciones para eliminar feedback
  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo')
  ],

  // Validaciones para obtener estadísticas
  getStats: [
    query('ficha')
      .optional()
      .isString()
      .withMessage('El código de ficha debe ser una cadena de texto'),
    
    query('nivel')
      .optional()
      .isString()
      .withMessage('El nivel debe ser una cadena de texto'),
    
    query('instructor')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del instructor debe ser un número entero positivo')
  ],

  // Validaciones para obtener detalles de estudiante
  getStudentDetails: [
    param('apprenticeId')
      .isInt({ min: 1 })
      .withMessage('El ID del aprendiz debe ser un número entero positivo')
  ]
};

module.exports = { feedbackValidation };