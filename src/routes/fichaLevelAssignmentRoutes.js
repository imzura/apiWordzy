import { Router } from "express"
import {
  getFichaLevelAssignment,
  saveFichaLevelAssignment,
  getAllFichaLevelAssignments,
  deleteFichaLevelAssignment,
  getFichaLevelStats,
  searchFichas,
} from "../controllers/fichaLevelAssignmentController.js"

const router = Router()

// Rutas específicas (orden importante)
router.get("/stats", getFichaLevelStats)
router.get("/search", searchFichas)
router.get("/", getAllFichaLevelAssignments)
router.get("/:courseId", getFichaLevelAssignment)
router.post("/:courseId", saveFichaLevelAssignment)
router.put("/:courseId", saveFichaLevelAssignment)
router.delete("/:courseId", deleteFichaLevelAssignment)

export default router
