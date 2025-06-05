import { Router } from "express"
import { getAllApprentices, getApprenticeById, getApprenticeStats } from "../controllers/apprenticeController.js"

const routesApprentice = Router()

// Solo rutas de lectura para aprendices
routesApprentice.get("/", getAllApprentices)
routesApprentice.get("/stats", getApprenticeStats)
routesApprentice.get("/:id", getApprenticeById)

export default routesApprentice
