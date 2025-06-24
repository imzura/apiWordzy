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
router.get("/", authMiddleware, getCourses)
router.get("/:id", authMiddleware, getCourseById)
router.post("/", authMiddleware, createCourse)
router.put("/:id", authMiddleware, updateCourse)
router.delete("/:id", authMiddleware, deleteCourse)

// Rutas para API externa
router.get("/external/courses", authMiddleware, getExternalCourses)
router.post("/sync", authMiddleware, syncCourses)
router.get("/connectivity/check", authMiddleware, checkConnectivity)

export default router
