import SupportMaterial from "../models/supportMaterial.js";

class SupportMaterialService {
  async getAllMaterials(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit
      const query = {}

      // Aplicar filtros
      if (filters.tema) {
        query.tema = { $regex: filters.tema, $options: "i" }
      }
      if (filters.tipo) {
        query.tipo = filters.tipo
      }
      if (filters.estado) {
        query.estado = filters.estado
      }

      console.log("Query para obtener materiales:", query)

      const [materials, totalCount] = await Promise.all([
        SupportMaterial.find(query)
          .select("-creado_por")
          .sort({ fecha_creacion: -1 })
          .skip(skip)
          .limit(Number.parseInt(limit))
          .lean(),
        SupportMaterial.countDocuments(query),
      ])

      return {
        materials,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: Number.parseInt(limit),
        },
      }
    } catch (error) {
      console.error("Error en getAllMaterials service:", error)
      throw error
    }
  }

  async getMaterialById(id) {
    try {
      return await SupportMaterial.findById(id).select("-creado_por").lean()
    } catch (error) {
      console.error("Error en getMaterialById service:", error)
      throw error
    }
  }

  async createMaterial(materialData) {
    try {
      console.log("Creando material con datos:", materialData)

      // Validar datos requeridos
      if (!materialData.titulo || materialData.titulo.trim() === "") {
        throw new Error("El título es obligatorio")
      }

      if (!materialData.tema || materialData.tema.trim() === "") {
        throw new Error("El tema es obligatorio")
      }

      if (!materialData.contenido || materialData.contenido.trim() === "") {
        throw new Error("El contenido es obligatorio")
      }

      const material = new SupportMaterial(materialData)
      const savedMaterial = await material.save()

      console.log("Material creado exitosamente:", savedMaterial._id)
      return savedMaterial
    } catch (error) {
      console.error("Error en createMaterial service:", error)

      // Si es un error de validación de Mongoose
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message)
        throw new Error(`Error de validación: ${messages.join(", ")}`)
      }

      throw error
    }
  }

  async updateMaterial(id, updateData) {
    try {
      console.log("Actualizando material:", id, updateData)

      const updatedMaterial = await SupportMaterial.findByIdAndUpdate(
        id,
        {
          ...updateData,
          fecha_actualizacion: new Date(),
        },
        {
          new: true,
          runValidators: true,
        },
      ).select("-creado_por")

      return updatedMaterial
    } catch (error) {
      console.error("Error en updateMaterial service:", error)

      // Si es un error de validación de Mongoose
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message)
        throw new Error(`Error de validación: ${messages.join(", ")}`)
      }

      throw error
    }
  }

  async deleteMaterial(id) {
    try {
      console.log(`Eliminando material con ID: ${id} de la base de datos MongoDB...`)

      // Usar findByIdAndDelete para eliminar permanentemente de la base de datos
      const result = await SupportMaterial.findByIdAndDelete(id)

      if (result) {
        console.log(`Material eliminado exitosamente de la base de datos:`, result._id)
        return true
      } else {
        console.log(`No se encontró material con ID: ${id}`)
        return false
      }
    } catch (error) {
      console.error("Error en deleteMaterial service:", error)
      throw error
    }
  }

  async getTopics() {
    try {
      const topics = await SupportMaterial.distinct("tema", { estado: "activo" })
      return topics.sort()
    } catch (error) {
      console.error("Error en getTopics service:", error)
      throw error
    }
  }

  async searchMaterials(searchTerm) {
    try {
      return await SupportMaterial.find({
        $text: { $search: searchTerm },
        estado: "activo",
      })
        .select("-creado_por -contenido")
        .sort({ fecha_creacion: -1 })
        .lean()
    } catch (error) {
      console.error("Error en searchMaterials service:", error)
      throw error
    }
  }
}

// Exportar una instancia de la clase
const supportMaterialService = new SupportMaterialService()
export default supportMaterialService
