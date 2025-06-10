const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ")
  }

  // Error de cast de Mongoose (ID inválido)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404
    message = "Recurso no encontrado"
  }

  // Error de duplicado de MongoDB
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message = `El ${field} ya existe`
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

export default { notFound, errorHandler }
