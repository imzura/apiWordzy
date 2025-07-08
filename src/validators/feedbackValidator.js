const { body, query, param } = require("express-validator")

// Validaciones para crear/actualizar feedback
const feedbackValidation = [
  // Validaciones para apprenticeId
  body("apprenticeId")
    .notEmpty()
    .withMessage("El ID del aprendiz es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID del aprendiz debe ser un número entero positivo"),

  // Validaciones para instructorId
  body("instructorId")
    .notEmpty()
    .withMessage("El ID del instructor es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID del instructor debe ser un número entero positivo"),

  // Validaciones para courseId
  body("courseId")
    .notEmpty()
    .withMessage("El ID del curso es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID del curso debe ser un número entero positivo"),

  // Validaciones para level
  body("level")
    .notEmpty()
    .withMessage("El nivel es requerido")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nivel debe tener entre 1 y 50 caracteres")
    .trim(),

  // Validaciones para feedbackType
  body("feedbackType")
    .notEmpty()
    .withMessage("El tipo de feedback es requerido")
    .isIn(["positivo", "constructivo", "neutral"])
    .withMessage("El tipo de feedback debe ser: positivo, constructivo o neutral"),

  // Validaciones para category
  body("category")
    .notEmpty()
    .withMessage("La categoría es requerida")
    .isIn(["tecnico", "actitudinal", "participacion", "puntualidad", "trabajo_equipo"])
    .withMessage("La categoría debe ser: tecnico, actitudinal, participacion, puntualidad o trabajo_equipo"),

  // Validaciones para title
  body("title")
    .notEmpty()
    .withMessage("El título es requerido")
    .isLength({ min: 5, max: 200 })
    .withMessage("El título debe tener entre 5 y 200 caracteres")
    .trim(),

  // Validaciones para description
  body("description")
    .notEmpty()
    .withMessage("La descripción es requerida")
    .isLength({ min: 10 })
    .withMessage("La descripción debe tener al menos 10 caracteres")
    .trim(),

  // Validaciones para recommendations (opcional)
  body("recommendations")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Las recomendaciones no pueden exceder 1000 caracteres")
    .trim(),

  // Validaciones para priority (opcional)
  body("priority")
    .optional()
    .isIn(["baja", "media", "alta"])
    .withMessage("La prioridad debe ser: baja, media o alta"),

  // Validaciones para status (opcional)
  body("status")
    .optional()
    .isIn(["pendiente", "revisado", "resuelto"])
    .withMessage("El estado debe ser: pendiente, revisado o resuelto"),

  // Validaciones para isPrivate (opcional)
  body("isPrivate")
    .optional()
    .isBoolean()
    .withMessage("isPrivate debe ser un valor booleano"),
]

// Validaciones para filtros de búsqueda
const feedbackFilterValidation = [
  // Validación para ficha
  query("ficha")
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage("El código de ficha debe tener entre 1 y 20 caracteres")
    .trim(),

  // Validación para nivel
  query("nivel")
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("El nivel debe tener entre 1 y 50 caracteres")
    .trim(),

  // Validación para instructor
  query("instructor")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID del instructor debe ser un número entero positivo"),

  // Validación para tipo
  query("tipo")
    .optional()
    .isIn(["positivo", "constructivo", "neutral"])
    .withMessage("El tipo debe ser: positivo, constructivo o neutral"),

  // Validación para categoria
  query("categoria")
    .optional()
    .isIn(["tecnico", "actitudinal", "participacion", "puntualidad", "trabajo_equipo"])
    .withMessage("La categoría debe ser: tecnico, actitudinal, participacion, puntualidad o trabajo_equipo"),

  // Validación para estado
  query("estado")
    .optional()
    .isIn(["pendiente", "revisado", "resuelto"])
    .withMessage("El estado debe ser: pendiente, revisado o resuelto"),

  // Validación para prioridad
  query("prioridad")
    .optional()
    .isIn(["baja", "media", "alta"])
    .withMessage("La prioridad debe ser: baja, media o alta"),

  // Validación para page
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero positivo"),

  // Validación para limit
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un número entre 1 y 100"),
]

// Validación para parámetros de ID
const feedbackIdValidation = [param("id").isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo")]

// Validación para apprenticeId en parámetros
const apprenticeIdValidation = [
  param("apprenticeId").isInt({ min: 1 }).withMessage("El ID del aprendiz debe ser un número entero positivo"),
]

module.exports = {
  feedbackValidation,
  feedbackFilterValidation,
  feedbackIdValidation,
  apprenticeIdValidation,
}
