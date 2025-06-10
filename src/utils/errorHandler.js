import { errorResponse } from "./responseHandler.js"

export const handleError = (res, error) => {
  console.error("Error capturado:", error)
  console.error("Stack trace:", error.stack)

  // Error de validación de Mongoose
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err) => err.message)
    return errorResponse(res, "Error de validación", 400, {
      errors: messages,
    })
  }

  // Error de cast (ID inválido)
  if (error.name === "CastError") {
    return errorResponse(res, "ID inválido", 400)
  }

  // Error de duplicado (clave única)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return errorResponse(res, `El ${field} ya existe`, 400)
  }

  // Error de conexión a la base de datos
  if (error.name === "MongoNetworkError" || error.name === "MongooseServerSelectionError") {
    return errorResponse(res, "Error de conexión a la base de datos", 503)
  }

  // Error personalizado con código de estado
  if (error.statusCode) {
    return errorResponse(res, error.message, error.statusCode)
  }

  // Error genérico del servidor
  return errorResponse(res, "Error interno del servidor", 500, {
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
}
