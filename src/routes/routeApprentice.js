import { Router } from "express"
// #inicio modulos dickson
import { getAllUsers, getUserById, getUserStats } from "../controllers/userController.js"

const routesApprentice = Router()

//para filtrar solo aprendices
const filterApprentices = (req, res, next) => {
  req.query.tipoUsuario = "aprendiz"
  next()
}

// Solo rutas de lectura para aprendices (usando controlador unificado)
routesApprentice.get("/", filterApprentices, getAllUsers)
routesApprentice.get("/stats", filterApprentices, getUserStats)
routesApprentice.get("/:id", getUserById)
// #fin modulos dickson

export default routesApprentice
