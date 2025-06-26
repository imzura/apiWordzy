import { Router } from "express"
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getExternalCourses,
  syncCourses,
  checkConnectivity,
} from "../controllers/courseController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = Router()

// Rutas para cursos locales
router.get("/", getCourses)
router.get("/:id", getCourseById)
router.post("/", createCourse)
router.put("/:id", updateCourse)
router.delete("/:id", deleteCourse)

// Rutas para API externa
router.get("/external/courses", authMiddleware, getExternalCourses)
router.post("/sync", authMiddleware, syncCourses)
router.get("/connectivity/check", authMiddleware, checkConnectivity)

export default router
