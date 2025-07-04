const { validationResult } = require("express-validator")
const { responseHandler } = require("../utils/responseHandler")

/**
 * Middleware para validar datos de feedback después de las validaciones de express-validator
 * Realiza validaciones adicionales de negocio específicas para feedback
 */
const validateFeedback = (req, res, next) => {
  try {
    // Verificar errores de validación básica
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return responseHandler.error(res, "Errores de validación", 400, errors.array())
    }

    const { body } = req
    const customErrors = []

    // Validaciones específicas de negocio para feedback

    // 1. Validar que el título no contenga solo espacios
    if (body.title && body.title.trim().length === 0) {
      customErrors.push({
        field: "title",
        message: "El título no puede estar vacío o contener solo espacios",
      })
    }

    // 2. Validar que la descripción tenga contenido significativo
    if (body.description && body.description.trim().length < 10) {
      customErrors.push({
        field: "description",
        message: "La descripción debe tener al menos 10 caracteres significativos",
      })
    }

    // 3. Validar coherencia entre tipo de feedback y prioridad
    if (body.feedbackType === "positivo" && body.priority === "alta") {
      // Los feedbacks positivos normalmente no requieren alta prioridad
      // Esto es más una advertencia, pero lo permitimos
    }

    // 4. Validar que si es feedback constructivo, tenga recomendaciones
    if (body.feedbackType === "constructivo" && (!body.recommendations || body.recommendations.trim().length < 5)) {
      customErrors.push({
        field: "recommendations",
        message: "Los feedbacks constructivos deben incluir recomendaciones específicas (mínimo 5 caracteres)",
      })
    }

    // 5. Validar combinaciones de categoría y tipo
    const categoryTypeValidations = {
      tecnico: ["constructivo", "positivo", "neutral"],
      actitudinal: ["constructivo", "positivo", "neutral"],
      participacion: ["constructivo", "positivo"],
      puntualidad: ["constructivo", "neutral"],
      trabajo_equipo: ["constructivo", "positivo", "neutral"],
    }

    if (body.category && body.feedbackType) {
      const validTypes = categoryTypeValidations[body.category]
      if (validTypes && !validTypes.includes(body.feedbackType)) {
        customErrors.push({
          field: "feedbackType",
          message: `El tipo de feedback '${body.feedbackType}' no es apropiado para la categoría '${body.category}'`,
        })
      }
    }

    // 6. Validar longitud máxima de campos de texto
    if (body.description && body.description.length > 2000) {
      customErrors.push({
        field: "description",
        message: "La descripción no puede exceder 2000 caracteres",
      })
    }

    if (body.recommendations && body.recommendations.length > 1000) {
      customErrors.push({
        field: "recommendations",
        message: "Las recomendaciones no pueden exceder 1000 caracteres",
      })
    }

    // 7. Validar que los IDs sean números positivos válidos
    const numericFields = ["apprenticeId", "instructorId", "courseId"]
    numericFields.forEach((field) => {
      if (body[field] !== undefined) {
        const value = Number.parseInt(body[field])
        if (isNaN(value) || value <= 0) {
          customErrors.push({
            field: field,
            message: `${field} debe ser un número entero positivo válido`,
          })
        }
      }
    })

    // 8. Validar nivel si está presente
    if (body.level && (body.level.trim().length === 0 || body.level.length > 50)) {
      customErrors.push({
        field: "level",
        message: "El nivel debe tener entre 1 y 50 caracteres",
      })
    }

    // Si hay errores personalizados, retornarlos
    if (customErrors.length > 0) {
      return responseHandler.error(res, "Errores de validación de negocio", 400, customErrors)
    }

    // Limpiar y normalizar datos antes de continuar
    if (body.title) {
      body.title = body.title.trim()
    }

    if (body.description) {
      body.description = body.description.trim()
    }

    if (body.recommendations) {
      body.recommendations = body.recommendations.trim()
    }

    if (body.level) {
      body.level = body.level.trim()
    }

    // Si todo está bien, continuar al siguiente middleware
    next()
  } catch (error) {
    console.error("Error en validateFeedback middleware:", error)
    return responseHandler.error(res, "Error interno en la validación", 500)
  }
}

module.exports = validateFeedback
