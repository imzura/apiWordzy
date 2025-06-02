// Middleware para manejar errores globalmente
export const errorHandler = (err, req, res, next) => {
  console.error("Error capturado por el middleware:", err)

  // Determinar el código de estado
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500

  // Formatear el mensaje de error
  let errorMessage = err.message || "Error interno del servidor"
  let errorDetails = null

  // Manejar diferentes tipos de errores
  if (err.name === "ValidationError") {
    // Error de validación de Mongoose
    errorMessage = "Error de validación"
    errorDetails = Object.keys(err.errors)
      .map((key) => {
        return `${key}: ${err.errors[key].message}`
      })
      .join(", ")
  } else if (err.name === "CastError") {
    // Error de tipo de Mongoose
    errorMessage = "Error de tipo de datos"
    errorDetails = `Campo '${err.path}': se esperaba ${err.kind}`
  } else if (err.code === 11000) {
    // Error de duplicado de Mongoose
    errorMessage = "Error de duplicado"
    errorDetails = `El campo ${Object.keys(err.keyValue)} ya existe con el valor ${Object.values(err.keyValue)}`
  } else if (err.type === "entity.parse.failed") {
    // Error de parsing de JSON
    errorMessage = "Error al procesar los datos JSON"
    errorDetails = "La solicitud contiene JSON inválido"
  }

  // Enviar respuesta de error
  res.status(statusCode).json({
    message: errorMessage,
    error: errorDetails || err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  })
}
