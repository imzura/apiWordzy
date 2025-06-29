import { Router } from "express"
import routesTopic from "./routesTopic.js"
import routesRole from "./routesRole.js"
import routesPermission from "./routesPermission.js"
import routesEvaluation from "./routeEvaluation.js"
import routesInstructor from "./routeInstructor.js"
import routesApprentice from "./routeApprentice.js"
import routesCoursePrograming from "./routesCourseProgramming.js"
import routesSupportMaterial from "./supportMaterialRoutes.js"
import routesUpload from "./uploadRoutes.js"
import routesUpload1 from "./uploadRoutes1.js"
import routesUser from "./routeUser.js"
import programRoutes from "./routesProgram.js" // ✅ AGREGAR ESTA LÍNEA
import courseRoutes from "./routesCourse.js"
import scaleRoutes from "./scaleRoutes.js"

const router = Router()

router.use("/topic", routesTopic)
router.use("/role", routesRole)
router.use("/permission", routesPermission)
router.use("/evaluation", routesEvaluation)
router.use("/instructor", routesInstructor)
router.use("/apprentice", routesApprentice)
router.use("/course-programming", routesCoursePrograming)
router.use("/program", programRoutes) // ✅ AGREGAR ESTA LÍNEA
router.use("/support-materials", routesSupportMaterial)
router.use("/upload", routesUpload)
router.use("/upload/support-material", routesUpload1)
router.use("/user", routesUser)
router.use("/course", courseRoutes)
router.use("/scales", scaleRoutes)

export default router
