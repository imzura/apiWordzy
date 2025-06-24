// import jwt from "jsonwebtoken"
// import { errorResponse } from "../utils/responseHandler.js"

// const authMiddleware = (req, res, next) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "")

//     if (!token) {
//       return errorResponse(res, "Token de acceso requerido", 401)
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     req.user = decoded
//     next()
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return errorResponse(res, "Token expirado", 401)
//     }

//     if (error.name === "JsonWebTokenError") {
//       return errorResponse(res, "Token inválido", 401)
//     }

//     return errorResponse(res, "Error de autenticación", 401)
//   }
// }

// export default authMiddleware
import { errorResponse } from "../utils/responseHandler.js"

const authMiddleware = (req, res, next) => {
  try {
    // Obtener la API key del header
    const apiKey = req.header("x-api-key")

    console.log("🔍 Checking API Key:", apiKey ? "Present" : "Missing")

    if (!apiKey) {
      return errorResponse(res, "API Key requerida", 401)
    }

    // Verificar que la API key sea válida
    const validApiKey = "sara_d32775a2ea8a39a3.a14bb968e21a6be6821d19f2764945338ba182b972aff43732b0c7c8314d343a"

    if (apiKey !== validApiKey) {
      console.log("❌ Invalid API Key provided:", apiKey)
      return errorResponse(res, "API Key inválida", 401)
    }

    console.log("✅ API Key válida")

    // Si la API key es válida, continuar
    next()
  } catch (error) {
    console.error("❌ Auth middleware error:", error)
    return errorResponse(res, "Error de autenticación", 500)
  }
}

export default authMiddleware
