import { Router } from "express"
import Role from "../models/role.js"
// #inicio modulos dickson
import { getAllUsers, getUserById, getUserStats, createUser } from "../controllers/userController.js"

const routesApprentice = Router()

// Middleware para depurar solicitudes específicas de esta ruta
const debugRequest = (req, res, next) => {
  console.log(`=== SOLICITUD A ${req.method} ${req.originalUrl} ===`)
  console.log("Headers:", req.headers["content-type"])
  console.log("Body keys:", Object.keys(req.body))
  console.log("Query params:", req.query)
  next()
}

// Middleware para filtrar solo aprendices
const filterApprentices = (req, res, next) => {
  req.query.tipoUsuario = "aprendiz"
  next()
}

// Middleware para asegurar que el body tenga tipoUsuario = aprendiz
const ensureApprenticeType = (req, res, next) => {
  req.body.tipoUsuario = "aprendiz"
  next()
}

// Middleware para asignar rol de Aprendiz automáticamente
const assignApprenticeRole = async (req, res, next) => {
  try {
    console.log("=== ASIGNANDO ROL DE APRENDIZ ===")

    const apprenticeRole = await Role.findOne({
      name: "Aprendiz",
      status: true,
    })

    if (!apprenticeRole) {
      console.error("No se encontró el rol 'Aprendiz' activo")
      return res.status(400).json({
        message: "No se encontró el rol 'Aprendiz'. Contacte al administrador.",
      })
    }

    console.log(`Rol de Aprendiz encontrado: ${apprenticeRole._id}`)
    req.body.role = apprenticeRole._id

    // Asegurar que la contraseña sea el documento si no se proporciona
    if (!req.body.contraseña && req.body.documento) {
      req.body.contraseña = req.body.documento
      console.log("Contraseña asignada automáticamente como el documento")
    }

    next()
  } catch (error) {
    console.error("Error al asignar rol de aprendiz:", error)
    res.status(500).json({
      message: "Error al asignar rol de aprendiz",
      error: error.message,
    })
  }
}

// Rutas de aprendices (usando controlador unificado)
routesApprentice.get("/", filterApprentices, getAllUsers)
routesApprentice.get("/stats", filterApprentices, getUserStats)
routesApprentice.get("/:id", getUserById)
routesApprentice.post("/", debugRequest, ensureApprenticeType, assignApprenticeRole, createUser)
// #fin modulos dickson

export default routesApprentice
