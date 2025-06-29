// // // import { Router } from "express"
// // // import {
// // //   getProgram,
// // //   getProgramById,
// // //   createProgram,
// // //   updateProgram,
// // //   deleteProgram,
// // //   getExternalPrograms,
// // //   syncPrograms,
// // //   checkConnectivity,
// // // } from "../controllers/programController.js"

// // // const routesProgram = Router()

// // // // Rutas básicas CRUD
// // // routesProgram.get("/", getProgram)
// // // routesProgram.get("/:id", getProgramById)
// // // routesProgram.post("/", createProgram)
// // // routesProgram.put("/:id", updateProgram)
// // // routesProgram.delete("/:id", deleteProgram)

// // // // Rutas para API externa
// // // routesProgram.get("/external/programs", getExternalPrograms)
// // // routesProgram.post("/sync/massive", syncPrograms)
// // // routesProgram.get("/connectivity/check", checkConnectivity)

// // // export default routesProgram
// // import { Router } from "express"
// // import {
// //   getProgram,
// //   getProgramById,
// //   createProgram,
// //   updateProgram,
// //   deleteProgram,
// //   getExternalPrograms,
// //   syncPrograms,
// //   checkConnectivity,
// // } from "../controllers/programController.js"
// // import  authMiddleware from "../middlewares/authMiddleware.js"

// // const router = Router()

// // // Rutas CRUD básicas
// // router.get("/", authMiddleware, getProgram)
// // router.get("/:id", authMiddleware, getProgramById)
// // router.post("/", authMiddleware, createProgram)
// // router.put("/:id", authMiddleware, updateProgram)
// // router.delete("/:id", authMiddleware, deleteProgram)

// // // Rutas para API externa
// // router.get("/external/programs", authMiddleware, getExternalPrograms)
// // router.post("/sync/massive", authMiddleware, syncPrograms)
// // router.get("/connectivity/check", authMiddleware, checkConnectivity)

// // export default router
// import { Router } from "express"
// import {
//   getProgram,
//   getProgramById,
//   createProgram,
//   updateProgram,
//   deleteProgram,
//   getExternalPrograms,
//   syncPrograms,
//   checkConnectivity,
// } from "../controllers/programController.js"
// import authMiddleware from "../middlewares/authMiddleware.js"

// const router = Router()

// // Rutas CRUD básicas con middleware de API key
// router.get("/", authMiddleware, getProgram)
// router.get("/:id", authMiddleware, getProgramById)
// router.post("/", authMiddleware, createProgram)
// router.put("/:id", authMiddleware, updateProgram)
// router.delete("/:id", authMiddleware, deleteProgram)

// // Rutas para API externa
// router.get("/external/programs", authMiddleware, getExternalPrograms)
// router.post("/sync/massive", authMiddleware, syncPrograms)
// router.get("/connectivity/check", authMiddleware, checkConnectivity)

// export default router
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
