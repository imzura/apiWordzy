import supportMaterialService from "../services/supportMaterialService.js"
import { handleError } from "../utils/errorHandler.js"
import { errorResponse, successResponse } from "../utils/responseHandler.js"

class SupportMaterialController {
  async getAllMaterials(req, res) {
    try {
      console.log("Obteniendo todos los materiales...")
      const { page = 1, limit = 10, tema, tipo, estado } = req.query
      const filters = { tema, tipo, estado }

      const result = await supportMaterialService.getAllMaterials(page, limit, filters)

      return successResponse(res, "Materiales de apoyo obtenidos exitosamente", result)
    } catch (error) {
      console.error("Error en getAllMaterials:", error)
      return handleError(res, error)
    }
  }

  async getMaterialById(req, res) {
    try {
      const { id } = req.params
      const material = await supportMaterialService.getMaterialById(id)

      if (!material) {
        return errorResponse(res, "Material de apoyo no encontrado", 404)
      }

      return successResponse(res, "Material de apoyo obtenido exitosamente", material)
    } catch (error) {
      console.error("Error en getMaterialById:", error)
      return handleError(res, error)
    }
  }

  async createMaterial(req, res) {
    try {
      console.log("Datos recibidos en el controlador:", req.body)

      // Usar directamente los datos sin agregar creado_por
      const materialData = { ...req.body }

      console.log("Datos procesados para crear:", materialData)

      const newMaterial = await supportMaterialService.createMaterial(materialData)

      return successResponse(res, "Material de apoyo creado exitosamente", newMaterial, 201)
    } catch (error) {
      console.error("Error en createMaterial:", error)
      console.error("Stack trace:", error.stack)
      return handleError(res, error)
    }
  }

  async updateMaterial(req, res) {
    try {
      const { id } = req.params
      const updateData = req.body

      console.log("Actualizando material:", id, updateData)

      const updatedMaterial = await supportMaterialService.updateMaterial(id, updateData)

      if (!updatedMaterial) {
        return errorResponse(res, "Material de apoyo no encontrado", 404)
      }

      return successResponse(res, "Material de apoyo actualizado exitosamente", updatedMaterial)
    } catch (error) {
      console.error("Error en updateMaterial:", error)
      return handleError(res, error)
    }
  }

  async deleteMaterial(req, res) {
    try {
      const { id } = req.params

      console.log(`Eliminando material con ID: ${id} de la base de datos...`)

      // Verificar que el material existe antes de eliminarlo
      const existingMaterial = await supportMaterialService.getMaterialById(id)
      if (!existingMaterial) {
        return errorResponse(res, "Material de apoyo no encontrado", 404)
      }

      // Eliminar el material de la base de datos
      const deleted = await supportMaterialService.deleteMaterial(id)

      if (!deleted) {
        return errorResponse(res, "No se pudo eliminar el material de apoyo", 500)
      }

      console.log(`Material con ID: ${id} eliminado exitosamente de la base de datos`)
      return successResponse(res, "Material de apoyo eliminado exitosamente de la base de datos")
    } catch (error) {
      console.error("Error en deleteMaterial:", error)
      return handleError(res, error)
    }
  }

  async getTopics(req, res) {
    try {
      console.log("Obteniendo temas...")
      const topics = await supportMaterialService.getTopics()
      return successResponse(res, "Temas obtenidos exitosamente", topics)
    } catch (error) {
      console.error("Error en getTopics:", error)
      return handleError(res, error)
    }
  }
}

export default new SupportMaterialController()