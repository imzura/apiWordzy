import jwt from "jsonwebtoken"
import { errorResponse } from "../utils/responseHandler.js"

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return errorResponse(res, "Token de acceso requerido", 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, "Token expirado", 401)
    }

    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, "Token inválido", 401)
    }

    return errorResponse(res, "Error de autenticación", 401)
  }
}

export default authMiddleware
