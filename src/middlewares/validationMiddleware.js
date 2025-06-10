import { errorResponse } from "../utils/responseHandler.js"

export const validateRequest = (req, res, next) => {
  if (req.validationError) {
    console.error("Error de validación detallado:", {
      body: req.body,
      errors: req.validationError.details,
      path: req.path,
      method: req.method,
    })

    const errors = req.validationError.details.reduce((acc, error) => {
      acc[error.path.join(".")] = error.message
      return acc
    }, {})

    return errorResponse(res, "Error de validación", 400, errors)
  }
  next()
}
