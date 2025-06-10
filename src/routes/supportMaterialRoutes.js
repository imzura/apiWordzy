import { Router } from "express";
import SupportMaterialController from "../controllers/supportMaterialController.js";
import { validateSupportMaterial } from "../validators/supportMaterialValidator.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";

// Middleware temporal que simula un usuario (para testing)
const tempAuthMiddleware = (req, res, next) => {
  // Simular usuario autenticado para testing
  req.user = {
    id: "temp_user_id",
    email: "test@example.com",
  }
  next()
}

const routesSupportMaterial = Router();

// Rutas públicas (sin autenticación por ahora)
routesSupportMaterial.get("/", SupportMaterialController.getAllMaterials)
routesSupportMaterial.get("/topics", SupportMaterialController.getTopics)
routesSupportMaterial.get("/:id", SupportMaterialController.getMaterialById)

// Rutas que requieren autenticación (usando middleware temporal)
routesSupportMaterial.post("/", tempAuthMiddleware, validateSupportMaterial, validateRequest, SupportMaterialController.createMaterial)

routesSupportMaterial.put(
  "/:id",
  tempAuthMiddleware,
  validateSupportMaterial,
  validateRequest,
  SupportMaterialController.updateMaterial,
)

routesSupportMaterial.delete("/:id", tempAuthMiddleware, SupportMaterialController.deleteMaterial)

export default routesSupportMaterial


