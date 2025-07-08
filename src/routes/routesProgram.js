
import { Router } from "express"
import {
  getProgram,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  getExternalPrograms,
  syncPrograms,
  checkConnectivity,
} from "../controllers/programController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = Router()

// Rutas CRUD básicas con middleware de API key
router.get("/", getProgram)
router.get("/:id", getProgramById)
router.post("/", createProgram)
router.put("/:id", updateProgram)
router.delete("/:id", deleteProgram)

// Rutas para API externa
router.get("/external/programs", authMiddleware, getExternalPrograms)
router.post("/sync/massive", authMiddleware, syncPrograms)
router.get("/connectivity/check", authMiddleware, checkConnectivity)

export default router
