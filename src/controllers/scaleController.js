// // // // // // // // // // // // // const ScaleService = require("../services/scaleService")
// // // // // // // // // // // // // const { handleError } = require("../utils/errorHandler")
// // // // // // // // // // // // // const { successResponse, errorResponse } = require("../utils/responseHandler")

// // // // // // // // // // // // // class ScaleController {
// // // // // // // // // // // // //   async getAllScales(req, res) {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const { page = 1, limit = 10, estado } = req.query
// // // // // // // // // // // // //       const filters = { estado }

// // // // // // // // // // // // //       const result = await ScaleService.getAllScales(page, limit, filters)

// // // // // // // // // // // // //       return successResponse(res, "Escalas de valoración obtenidas exitosamente", result)
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   async getScaleById(req, res) {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const { id } = req.params
// // // // // // // // // // // // //       const scale = await ScaleService.getScaleById(id)

// // // // // // // // // // // // //       if (!scale) {
// // // // // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // // // // //       }

// // // // // // // // // // // // //       return successResponse(res, "Escala de valoración obtenida exitosamente", scale)
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   async createScale(req, res) {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const scaleData = {
// // // // // // // // // // // // //         ...req.body,
// // // // // // // // // // // // //         creado_por: req.user.id,
// // // // // // // // // // // // //       }

// // // // // // // // // // // // //       const newScale = await ScaleService.createScale(scaleData)

// // // // // // // // // // // // //       return successResponse(res, "Escala de valoración creada exitosamente", newScale, 201)
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   async updateScale(req, res) {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const { id } = req.params
// // // // // // // // // // // // //       const updateData = req.body

// // // // // // // // // // // // //       const updatedScale = await ScaleService.updateScale(id, updateData)

// // // // // // // // // // // // //       if (!updatedScale) {
// // // // // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // // // // //       }

// // // // // // // // // // // // //       return successResponse(res, "Escala de valoración actualizada exitosamente", updatedScale)
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   async deleteScale(req, res) {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const { id } = req.params

// // // // // // // // // // // // //       const deleted = await ScaleService.deleteScale(id)

// // // // // // // // // // // // //       if (!deleted) {
// // // // // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // // // // //       }

// // // // // // // // // // // // //       return successResponse(res, "Escala de valoración eliminada exitosamente")
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   async addMetric(req, res) {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const { id } = req.params
// // // // // // // // // // // // //       const metricData = { ...req.body, scale_id: id }

// // // // // // // // // // // // //       const newMetric = await ScaleService.addMetric(metricData)

// // // // // // // // // // // // //       return successResponse(res, "Métrica agregada exitosamente", newMetric, 201)
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   async updateMetric(req, res) {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const { id, metricId } = req.params
// // // // // // // // // // // // //       const updateData = req.body

// // // // // // // // // // // // //       const updatedMetric = await ScaleService.updateMetric(metricId, updateData)

// // // // // // // // // // // // //       if (!updatedMetric) {
// // // // // // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // // // // // //       }

// // // // // // // // // // // // //       return successResponse(res, "Métrica actualizada exitosamente", updatedMetric)
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   async deleteMetric(req, res) {
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       const { metricId } = req.params

// // // // // // // // // // // // //       const deleted = await ScaleService.deleteMetric(metricId)

// // // // // // // // // // // // //       if (!deleted) {
// // // // // // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // // // // // //       }

// // // // // // // // // // // // //       return successResponse(res, "Métrica eliminada exitosamente")
// // // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }
// // // // // // // // // // // // // }

// // // // // // // // // // // // // module.exports = new ScaleController()
// // // // // // // // // // // // const ScaleService = require("../services/scaleService")
// // // // // // // // // // // // const { handleError } = require("../utils/errorHandler")
// // // // // // // // // // // // const { successResponse, errorResponse } = require("../utils/responseHandler")

// // // // // // // // // // // // class ScaleController {
// // // // // // // // // // // //   async getAllScales(req, res) {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const { page = 1, limit = 10, estado } = req.query
// // // // // // // // // // // //       const filters = { estado }

// // // // // // // // // // // //       const result = await ScaleService.getAllScales(page, limit, filters)

// // // // // // // // // // // //       return successResponse(res, "Escalas de valoración obtenidas exitosamente", result)
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Error en getAllScales:", error)
// // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   async getScaleById(req, res) {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const { id } = req.params
// // // // // // // // // // // //       const scale = await ScaleService.getScaleById(id)

// // // // // // // // // // // //       if (!scale) {
// // // // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // // // //       }

// // // // // // // // // // // //       return successResponse(res, "Escala de valoración obtenida exitosamente", scale)
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Error en getScaleById:", error)
// // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   async createScale(req, res) {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       console.log("Datos recibidos para crear escala:", req.body)

// // // // // // // // // // // //       const scaleData = {
// // // // // // // // // // // //         ...req.body,
// // // // // // // // // // // //         // Solo agregar creado_por si existe el usuario en la request
// // // // // // // // // // // //         ...(req.user && { creado_por: req.user.id }),
// // // // // // // // // // // //       }

// // // // // // // // // // // //       console.log("Datos procesados para crear escala:", scaleData)

// // // // // // // // // // // //       const newScale = await ScaleService.createScale(scaleData)

// // // // // // // // // // // //       console.log("Escala creada exitosamente:", newScale)

// // // // // // // // // // // //       return successResponse(res, "Escala de valoración creada exitosamente", newScale, 201)
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Error detallado en createScale:", error)
// // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   async updateScale(req, res) {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const { id } = req.params
// // // // // // // // // // // //       const updateData = req.body

// // // // // // // // // // // //       console.log("Actualizando escala:", id, updateData)

// // // // // // // // // // // //       const updatedScale = await ScaleService.updateScale(id, updateData)

// // // // // // // // // // // //       if (!updatedScale) {
// // // // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // // // //       }

// // // // // // // // // // // //       return successResponse(res, "Escala de valoración actualizada exitosamente", updatedScale)
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Error en updateScale:", error)
// // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   async deleteScale(req, res) {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const { id } = req.params

// // // // // // // // // // // //       const deleted = await ScaleService.deleteScale(id)

// // // // // // // // // // // //       if (!deleted) {
// // // // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // // // //       }

// // // // // // // // // // // //       return successResponse(res, "Escala de valoración eliminada exitosamente")
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Error en deleteScale:", error)
// // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   async addMetric(req, res) {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const { id } = req.params
// // // // // // // // // // // //       const metricData = { ...req.body, scale_id: id }

// // // // // // // // // // // //       const newMetric = await ScaleService.addMetric(metricData)

// // // // // // // // // // // //       return successResponse(res, "Métrica agregada exitosamente", newMetric, 201)
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Error en addMetric:", error)
// // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   async updateMetric(req, res) {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const { id, metricId } = req.params
// // // // // // // // // // // //       const updateData = req.body

// // // // // // // // // // // //       const updatedMetric = await ScaleService.updateMetric(metricId, updateData)

// // // // // // // // // // // //       if (!updatedMetric) {
// // // // // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // // // // //       }

// // // // // // // // // // // //       return successResponse(res, "Métrica actualizada exitosamente", updatedMetric)
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Error en updateMetric:", error)
// // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }

// // // // // // // // // // // //   async deleteMetric(req, res) {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const { metricId } = req.params

// // // // // // // // // // // //       const deleted = await ScaleService.deleteMetric(metricId)

// // // // // // // // // // // //       if (!deleted) {
// // // // // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // // // // //       }

// // // // // // // // // // // //       return successResponse(res, "Métrica eliminada exitosamente")
// // // // // // // // // // // //     } catch (error) {
// // // // // // // // // // // //       console.error("Error en deleteMetric:", error)
// // // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // // //     }
// // // // // // // // // // // //   }
// // // // // // // // // // // // }

// // // // // // // // // // // // module.exports = new ScaleController()
// // // // // // // // // // // const ScaleService = require("../services/scaleService")
// // // // // // // // // // // const { handleError } = require("../utils/errorHandler")
// // // // // // // // // // // const { successResponse, errorResponse } = require("../utils/responseHandler")

// // // // // // // // // // // class ScaleController {
// // // // // // // // // // //   async getAllScales(req, res) {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const { page = 1, limit = 10, estado } = req.query
// // // // // // // // // // //       const filters = { estado }

// // // // // // // // // // //       const result = await ScaleService.getAllScales(page, limit, filters)

// // // // // // // // // // //       return successResponse(res, "Escalas de valoración obtenidas exitosamente", result)
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error en getAllScales:", error)
// // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // //     }
// // // // // // // // // // //   }

// // // // // // // // // // //   async getScaleById(req, res) {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const { id } = req.params
// // // // // // // // // // //       const scale = await ScaleService.getScaleById(id)

// // // // // // // // // // //       if (!scale) {
// // // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // // //       }

// // // // // // // // // // //       return successResponse(res, "Escala de valoración obtenida exitosamente", scale)
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error en getScaleById:", error)
// // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // //     }
// // // // // // // // // // //   }

// // // // // // // // // // //   async createScale(req, res) {
// // // // // // // // // // //     try {
// // // // // // // // // // //       console.log("Datos recibidos para crear escala:", JSON.stringify(req.body, null, 2))

// // // // // // // // // // //       // Limpiar y preparar los datos
// // // // // // // // // // //       const scaleData = {
// // // // // // // // // // //         ...req.body,
// // // // // // // // // // //         // Asegurar que las fechas sean válidas
// // // // // // // // // // //         fechaInicial: req.body.fechaInicial ? new Date(req.body.fechaInicial) : new Date(),
// // // // // // // // // // //         fechaFinal: req.body.fechaFinal ? new Date(req.body.fechaFinal) : new Date(),
// // // // // // // // // // //         // Asegurar que el porcentaje sea número
// // // // // // // // // // //         apruebaPorcentaje: Number(req.body.apruebaPorcentaje) || 70,
// // // // // // // // // // //         // Manejar creado_por de forma segura
// // // // // // // // // // //         creado_por: "sistema", // Valor por defecto
// // // // // // // // // // //       }

// // // // // // // // // // //       // Validar y limpiar métricas si existen
// // // // // // // // // // //       if (scaleData.metricas && Array.isArray(scaleData.metricas)) {
// // // // // // // // // // //         scaleData.metricas = scaleData.metricas.filter((metrica) => {
// // // // // // // // // // //           // Solo incluir métricas que tengan los campos requeridos
// // // // // // // // // // //           return metrica.concepto && typeof metrica.rangoInicial === "number" && typeof metrica.rangoFinal === "number"
// // // // // // // // // // //         })
// // // // // // // // // // //       } else {
// // // // // // // // // // //         scaleData.metricas = []
// // // // // // // // // // //       }

// // // // // // // // // // //       console.log("Datos procesados para crear escala:", JSON.stringify(scaleData, null, 2))

// // // // // // // // // // //       const newScale = await ScaleService.createScale(scaleData)

// // // // // // // // // // //       console.log("Escala creada exitosamente:", newScale._id)

// // // // // // // // // // //       return successResponse(res, "Escala de valoración creada exitosamente", newScale, 201)
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error detallado en createScale:", error)
// // // // // // // // // // //       console.error("Stack trace:", error.stack)
// // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // //     }
// // // // // // // // // // //   }

// // // // // // // // // // //   async updateScale(req, res) {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const { id } = req.params
// // // // // // // // // // //       const updateData = { ...req.body }

// // // // // // // // // // //       // Convertir fechas si vienen como string
// // // // // // // // // // //       if (updateData.fechaInicial) {
// // // // // // // // // // //         updateData.fechaInicial = new Date(updateData.fechaInicial)
// // // // // // // // // // //       }
// // // // // // // // // // //       if (updateData.fechaFinal) {
// // // // // // // // // // //         updateData.fechaFinal = new Date(updateData.fechaFinal)
// // // // // // // // // // //       }

// // // // // // // // // // //       // Asegurar que el porcentaje sea número
// // // // // // // // // // //       if (updateData.apruebaPorcentaje) {
// // // // // // // // // // //         updateData.apruebaPorcentaje = Number(updateData.apruebaPorcentaje)
// // // // // // // // // // //       }

// // // // // // // // // // //       console.log("Actualizando escala:", id, updateData)

// // // // // // // // // // //       const updatedScale = await ScaleService.updateScale(id, updateData)

// // // // // // // // // // //       if (!updatedScale) {
// // // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // // //       }

// // // // // // // // // // //       return successResponse(res, "Escala de valoración actualizada exitosamente", updatedScale)
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error en updateScale:", error)
// // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // //     }
// // // // // // // // // // //   }

// // // // // // // // // // //   async deleteScale(req, res) {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const { id } = req.params

// // // // // // // // // // //       const deleted = await ScaleService.deleteScale(id)

// // // // // // // // // // //       if (!deleted) {
// // // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // // //       }

// // // // // // // // // // //       return successResponse(res, "Escala de valoración eliminada exitosamente")
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error en deleteScale:", error)
// // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // //     }
// // // // // // // // // // //   }

// // // // // // // // // // //   async addMetric(req, res) {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const { id } = req.params
// // // // // // // // // // //       const metricData = { ...req.body }

// // // // // // // // // // //       const newMetric = await ScaleService.addMetric(id, metricData)

// // // // // // // // // // //       return successResponse(res, "Métrica agregada exitosamente", newMetric, 201)
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error en addMetric:", error)
// // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // //     }
// // // // // // // // // // //   }

// // // // // // // // // // //   async updateMetric(req, res) {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const { id, metricId } = req.params
// // // // // // // // // // //       const updateData = req.body

// // // // // // // // // // //       const updatedMetric = await ScaleService.updateMetric(id, metricId, updateData)

// // // // // // // // // // //       if (!updatedMetric) {
// // // // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // // // //       }

// // // // // // // // // // //       return successResponse(res, "Métrica actualizada exitosamente", updatedMetric)
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error en updateMetric:", error)
// // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // //     }
// // // // // // // // // // //   }

// // // // // // // // // // //   async deleteMetric(req, res) {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const { metricId } = req.params

// // // // // // // // // // //       const deleted = await ScaleService.deleteMetric(metricId)

// // // // // // // // // // //       if (!deleted) {
// // // // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // // // //       }

// // // // // // // // // // //       return successResponse(res, "Métrica eliminada exitosamente")
// // // // // // // // // // //     } catch (error) {
// // // // // // // // // // //       console.error("Error en deleteMetric:", error)
// // // // // // // // // // //       return handleError(res, error)
// // // // // // // // // // //     }
// // // // // // // // // // //   }
// // // // // // // // // // // }

// // // // // // // // // // // module.exports = new ScaleController()
// // // // // // // // // // const ScaleService = require("../services/scaleService")
// // // // // // // // // // const { handleError } = require("../utils/errorHandler")
// // // // // // // // // // const { successResponse, errorResponse } = require("../utils/responseHandler")

// // // // // // // // // // class ScaleController {
// // // // // // // // // //   async getAllScales(req, res) {
// // // // // // // // // //     try {
// // // // // // // // // //       const { page = 1, limit = 10, estado } = req.query
// // // // // // // // // //       const filters = { estado }

// // // // // // // // // //       const result = await ScaleService.getAllScales(page, limit, filters)

// // // // // // // // // //       return successResponse(res, "Escalas de valoración obtenidas exitosamente", result)
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Error en getAllScales:", error)
// // // // // // // // // //       return handleError(res, error)
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   async getScaleById(req, res) {
// // // // // // // // // //     try {
// // // // // // // // // //       const { id } = req.params
// // // // // // // // // //       const scale = await ScaleService.getScaleById(id)

// // // // // // // // // //       if (!scale) {
// // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // //       }

// // // // // // // // // //       return successResponse(res, "Escala de valoración obtenida exitosamente", scale)
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Error en getScaleById:", error)
// // // // // // // // // //       return handleError(res, error)
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   async createScale(req, res) {
// // // // // // // // // //     try {
// // // // // // // // // //       console.log("Datos recibidos para crear escala:", JSON.stringify(req.body, null, 2))

// // // // // // // // // //       // Limpiar y preparar los datos
// // // // // // // // // //       const scaleData = {
// // // // // // // // // //         ...req.body,
// // // // // // // // // //         // Asegurar que las fechas sean válidas
// // // // // // // // // //         fechaInicial: req.body.fechaInicial ? new Date(req.body.fechaInicial) : new Date(),
// // // // // // // // // //         fechaFinal: req.body.fechaFinal ? new Date(req.body.fechaFinal) : new Date(),
// // // // // // // // // //         // Asegurar que el porcentaje sea número
// // // // // // // // // //         apruebaPorcentaje: Number(req.body.apruebaPorcentaje) || 70,
// // // // // // // // // //         // Manejar creado_por de forma segura
// // // // // // // // // //         creado_por: "sistema", // Valor por defecto
// // // // // // // // // //       }

// // // // // // // // // //       // Validar y limpiar métricas si existen
// // // // // // // // // //       if (scaleData.metricas && Array.isArray(scaleData.metricas)) {
// // // // // // // // // //         scaleData.metricas = scaleData.metricas.filter((metrica) => {
// // // // // // // // // //           // Solo incluir métricas que tengan los campos requeridos
// // // // // // // // // //           return metrica.concepto && typeof metrica.rangoInicial === "number" && typeof metrica.rangoFinal === "number"
// // // // // // // // // //         })
// // // // // // // // // //       } else {
// // // // // // // // // //         scaleData.metricas = []
// // // // // // // // // //       }

// // // // // // // // // //       console.log("Datos procesados para crear escala:", JSON.stringify(scaleData, null, 2))

// // // // // // // // // //       const newScale = await ScaleService.createScale(scaleData)

// // // // // // // // // //       console.log("Escala creada exitosamente:", newScale._id)

// // // // // // // // // //       return successResponse(res, "Escala de valoración creada exitosamente", newScale, 201)
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Error detallado en createScale:", error)
// // // // // // // // // //       console.error("Stack trace:", error.stack)
// // // // // // // // // //       return handleError(res, error)
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   async updateScale(req, res) {
// // // // // // // // // //     try {
// // // // // // // // // //       const { id } = req.params
// // // // // // // // // //       console.log("Datos recibidos para actualizar escala:", JSON.stringify(req.body, null, 2))

// // // // // // // // // //       // Limpiar datos - remover campos que no deben actualizarse
// // // // // // // // // //       const updateData = { ...req.body }
// // // // // // // // // //       delete updateData._id
// // // // // // // // // //       delete updateData.__v
// // // // // // // // // //       delete updateData.fecha_creacion
// // // // // // // // // //       delete updateData.fecha_actualizacion
// // // // // // // // // //       delete updateData.createdAt
// // // // // // // // // //       delete updateData.updatedAt

// // // // // // // // // //       // Convertir fechas si vienen como string
// // // // // // // // // //       if (updateData.fechaInicial) {
// // // // // // // // // //         updateData.fechaInicial = new Date(updateData.fechaInicial)
// // // // // // // // // //       }
// // // // // // // // // //       if (updateData.fechaFinal) {
// // // // // // // // // //         updateData.fechaFinal = new Date(updateData.fechaFinal)
// // // // // // // // // //       }

// // // // // // // // // //       // Asegurar que el porcentaje sea número
// // // // // // // // // //       if (updateData.apruebaPorcentaje) {
// // // // // // // // // //         updateData.apruebaPorcentaje = Number(updateData.apruebaPorcentaje)
// // // // // // // // // //       }

// // // // // // // // // //       // Validar y limpiar métricas si existen
// // // // // // // // // //       if (updateData.metricas && Array.isArray(updateData.metricas)) {
// // // // // // // // // //         updateData.metricas = updateData.metricas.filter((metrica) => {
// // // // // // // // // //           return metrica.concepto && typeof metrica.rangoInicial === "number" && typeof metrica.rangoFinal === "number"
// // // // // // // // // //         })
// // // // // // // // // //       }

// // // // // // // // // //       console.log("Datos procesados para actualizar escala:", JSON.stringify(updateData, null, 2))

// // // // // // // // // //       const updatedScale = await ScaleService.updateScale(id, updateData)

// // // // // // // // // //       if (!updatedScale) {
// // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // //       }

// // // // // // // // // //       return successResponse(res, "Escala de valoración actualizada exitosamente", updatedScale)
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Error en updateScale:", error)
// // // // // // // // // //       return handleError(res, error)
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   async deleteScale(req, res) {
// // // // // // // // // //     try {
// // // // // // // // // //       const { id } = req.params

// // // // // // // // // //       const deleted = await ScaleService.deleteScale(id)

// // // // // // // // // //       if (!deleted) {
// // // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // // //       }

// // // // // // // // // //       return successResponse(res, "Escala de valoración eliminada exitosamente")
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Error en deleteScale:", error)
// // // // // // // // // //       return handleError(res, error)
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   async addMetric(req, res) {
// // // // // // // // // //     try {
// // // // // // // // // //       const { id } = req.params
// // // // // // // // // //       const metricData = { ...req.body }

// // // // // // // // // //       const newMetric = await ScaleService.addMetric(id, metricData)

// // // // // // // // // //       return successResponse(res, "Métrica agregada exitosamente", newMetric, 201)
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Error en addMetric:", error)
// // // // // // // // // //       return handleError(res, error)
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   async updateMetric(req, res) {
// // // // // // // // // //     try {
// // // // // // // // // //       const { id, metricId } = req.params
// // // // // // // // // //       const updateData = req.body

// // // // // // // // // //       const updatedMetric = await ScaleService.updateMetric(id, metricId, updateData)

// // // // // // // // // //       if (!updatedMetric) {
// // // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // // //       }

// // // // // // // // // //       return successResponse(res, "Métrica actualizada exitosamente", updatedMetric)
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Error en updateMetric:", error)
// // // // // // // // // //       return handleError(res, error)
// // // // // // // // // //     }
// // // // // // // // // //   }

// // // // // // // // // //   async deleteMetric(req, res) {
// // // // // // // // // //     try {
// // // // // // // // // //       const { metricId } = req.params

// // // // // // // // // //       const deleted = await ScaleService.deleteMetric(metricId)

// // // // // // // // // //       if (!deleted) {
// // // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // // //       }

// // // // // // // // // //       return successResponse(res, "Métrica eliminada exitosamente")
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Error en deleteMetric:", error)
// // // // // // // // // //       return handleError(res, error)
// // // // // // // // // //     }
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // module.exports = new ScaleController()
// // // // // // // // // const ScaleService = require("../services/scaleService")
// // // // // // // // // const { handleError } = require("../utils/errorHandler")
// // // // // // // // // const { successResponse, errorResponse } = require("../utils/responseHandler")

// // // // // // // // // class ScaleController {
// // // // // // // // //   async getAllScales(req, res) {
// // // // // // // // //     try {
// // // // // // // // //       const { page = 1, limit = 10, estado } = req.query
// // // // // // // // //       const filters = { estado }

// // // // // // // // //       const result = await ScaleService.getAllScales(page, limit, filters)

// // // // // // // // //       return successResponse(res, "Escalas de valoración obtenidas exitosamente", result)
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Error en getAllScales:", error)
// // // // // // // // //       return handleError(res, error)
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   async getScaleById(req, res) {
// // // // // // // // //     try {
// // // // // // // // //       const { id } = req.params
// // // // // // // // //       const scale = await ScaleService.getScaleById(id)

// // // // // // // // //       if (!scale) {
// // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // //       }

// // // // // // // // //       return successResponse(res, "Escala de valoración obtenida exitosamente", scale)
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Error en getScaleById:", error)
// // // // // // // // //       return handleError(res, error)
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   async createScale(req, res) {
// // // // // // // // //     try {
// // // // // // // // //       console.log("Datos recibidos para crear escala:", JSON.stringify(req.body, null, 2))

// // // // // // // // //       // Limpiar y preparar los datos
// // // // // // // // //       const scaleData = {
// // // // // // // // //         ...req.body,
// // // // // // // // //         // Asegurar que las fechas sean válidas
// // // // // // // // //         fechaInicial: req.body.fechaInicial ? new Date(req.body.fechaInicial) : new Date(),
// // // // // // // // //         fechaFinal: req.body.fechaFinal ? new Date(req.body.fechaFinal) : new Date(),
// // // // // // // // //         // Asegurar que el porcentaje sea número
// // // // // // // // //         apruebaPorcentaje: Number(req.body.apruebaPorcentaje) || 70,
// // // // // // // // //         // Manejar creado_por de forma segura
// // // // // // // // //         creado_por: "sistema", // Valor por defecto
// // // // // // // // //       }

// // // // // // // // //       // Validar y limpiar métricas si existen
// // // // // // // // //       if (scaleData.metricas && Array.isArray(scaleData.metricas)) {
// // // // // // // // //         scaleData.metricas = scaleData.metricas.filter((metrica) => {
// // // // // // // // //           // Solo incluir métricas que tengan los campos requeridos
// // // // // // // // //           return metrica.concepto && typeof metrica.rangoInicial === "number" && typeof metrica.rangoFinal === "number"
// // // // // // // // //         })
// // // // // // // // //       } else {
// // // // // // // // //         scaleData.metricas = []
// // // // // // // // //       }

// // // // // // // // //       console.log("Datos procesados para crear escala:", JSON.stringify(scaleData, null, 2))

// // // // // // // // //       const newScale = await ScaleService.createScale(scaleData)

// // // // // // // // //       console.log("Escala creada exitosamente:", newScale._id)

// // // // // // // // //       return successResponse(res, "Escala de valoración creada exitosamente", newScale, 201)
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Error detallado en createScale:", error)
// // // // // // // // //       console.error("Stack trace:", error.stack)
// // // // // // // // //       return handleError(res, error)
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   async updateScale(req, res) {
// // // // // // // // //     try {
// // // // // // // // //       const { id } = req.params
// // // // // // // // //       console.log("=== ACTUALIZAR ESCALA ===")
// // // // // // // // //       console.log("ID:", id)
// // // // // // // // //       console.log("Datos recibidos:", JSON.stringify(req.body, null, 2))

// // // // // // // // //       // Limpiar datos - remover campos que no deben actualizarse
// // // // // // // // //       const updateData = { ...req.body }
// // // // // // // // //       delete updateData._id
// // // // // // // // //       delete updateData.__v
// // // // // // // // //       delete updateData.fecha_creacion
// // // // // // // // //       delete updateData.fecha_actualizacion
// // // // // // // // //       delete updateData.createdAt
// // // // // // // // //       delete updateData.updatedAt

// // // // // // // // //       // Convertir fechas si vienen como string y validar
// // // // // // // // //       if (updateData.fechaInicial) {
// // // // // // // // //         updateData.fechaInicial = new Date(updateData.fechaInicial)
// // // // // // // // //         console.log("Fecha inicial convertida:", updateData.fechaInicial)
// // // // // // // // //       }
// // // // // // // // //       if (updateData.fechaFinal) {
// // // // // // // // //         updateData.fechaFinal = new Date(updateData.fechaFinal)
// // // // // // // // //         console.log("Fecha final convertida:", updateData.fechaFinal)
// // // // // // // // //       }

// // // // // // // // //       // Validar fechas antes de enviar a MongoDB
// // // // // // // // //       if (updateData.fechaInicial && updateData.fechaFinal) {
// // // // // // // // //         const fechaInicial = new Date(updateData.fechaInicial)
// // // // // // // // //         const fechaFinal = new Date(updateData.fechaFinal)

// // // // // // // // //         fechaInicial.setHours(0, 0, 0, 0)
// // // // // // // // //         fechaFinal.setHours(0, 0, 0, 0)

// // // // // // // // //         console.log("Comparando fechas:")
// // // // // // // // //         console.log("Fecha inicial (normalizada):", fechaInicial)
// // // // // // // // //         console.log("Fecha final (normalizada):", fechaFinal)

// // // // // // // // //         if (fechaFinal < fechaInicial) {
// // // // // // // // //           return errorResponse(res, "La fecha final debe ser igual o posterior a la fecha inicial", 400)
// // // // // // // // //         }
// // // // // // // // //       }

// // // // // // // // //       // Asegurar que el porcentaje sea número
// // // // // // // // //       if (updateData.apruebaPorcentaje) {
// // // // // // // // //         updateData.apruebaPorcentaje = Number(updateData.apruebaPorcentaje)
// // // // // // // // //       }

// // // // // // // // //       // Validar y limpiar métricas si existen
// // // // // // // // //       if (updateData.metricas && Array.isArray(updateData.metricas)) {
// // // // // // // // //         updateData.metricas = updateData.metricas.filter((metrica) => {
// // // // // // // // //           return metrica.concepto && typeof metrica.rangoInicial === "number" && typeof metrica.rangoFinal === "number"
// // // // // // // // //         })
// // // // // // // // //       }

// // // // // // // // //       console.log("Datos procesados para actualizar:", JSON.stringify(updateData, null, 2))

// // // // // // // // //       const updatedScale = await ScaleService.updateScale(id, updateData)

// // // // // // // // //       if (!updatedScale) {
// // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // //       }

// // // // // // // // //       return successResponse(res, "Escala de valoración actualizada exitosamente", updatedScale)
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Error en updateScale:", error)
// // // // // // // // //       return handleError(res, error)
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   async deleteScale(req, res) {
// // // // // // // // //     try {
// // // // // // // // //       const { id } = req.params

// // // // // // // // //       const deleted = await ScaleService.deleteScale(id)

// // // // // // // // //       if (!deleted) {
// // // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // // //       }

// // // // // // // // //       return successResponse(res, "Escala de valoración eliminada exitosamente")
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Error en deleteScale:", error)
// // // // // // // // //       return handleError(res, error)
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   async addMetric(req, res) {
// // // // // // // // //     try {
// // // // // // // // //       const { id } = req.params
// // // // // // // // //       const metricData = { ...req.body }

// // // // // // // // //       const newMetric = await ScaleService.addMetric(id, metricData)

// // // // // // // // //       return successResponse(res, "Métrica agregada exitosamente", newMetric, 201)
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Error en addMetric:", error)
// // // // // // // // //       return handleError(res, error)
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   async updateMetric(req, res) {
// // // // // // // // //     try {
// // // // // // // // //       const { id, metricId } = req.params
// // // // // // // // //       const updateData = req.body

// // // // // // // // //       const updatedMetric = await ScaleService.updateMetric(id, metricId, updateData)

// // // // // // // // //       if (!updatedMetric) {
// // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // //       }

// // // // // // // // //       return successResponse(res, "Métrica actualizada exitosamente", updatedMetric)
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Error en updateMetric:", error)
// // // // // // // // //       return handleError(res, error)
// // // // // // // // //     }
// // // // // // // // //   }

// // // // // // // // //   async deleteMetric(req, res) {
// // // // // // // // //     try {
// // // // // // // // //       const { metricId } = req.params

// // // // // // // // //       const deleted = await ScaleService.deleteMetric(metricId)

// // // // // // // // //       if (!deleted) {
// // // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // // //       }

// // // // // // // // //       return successResponse(res, "Métrica eliminada exitosamente")
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Error en deleteMetric:", error)
// // // // // // // // //       return handleError(res, error)
// // // // // // // // //     }
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // // module.exports = new ScaleController()
// // // // // // // // const ScaleService = require("../services/scaleService")
// // // // // // // // const { handleError } = require("../utils/errorHandler")
// // // // // // // // const { successResponse, errorResponse } = require("../utils/responseHandler")

// // // // // // // // class ScaleController {
// // // // // // // //   async getAllScales(req, res) {
// // // // // // // //     try {
// // // // // // // //       const { page = 1, limit = 10, estado } = req.query
// // // // // // // //       const filters = { estado }

// // // // // // // //       const result = await ScaleService.getAllScales(page, limit, filters)

// // // // // // // //       return successResponse(res, "Escalas de valoración obtenidas exitosamente", result)
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error en getAllScales:", error)
// // // // // // // //       return handleError(res, error)
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   async getScaleById(req, res) {
// // // // // // // //     try {
// // // // // // // //       const { id } = req.params
// // // // // // // //       const scale = await ScaleService.getScaleById(id)

// // // // // // // //       if (!scale) {
// // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // //       }

// // // // // // // //       return successResponse(res, "Escala de valoración obtenida exitosamente", scale)
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error en getScaleById:", error)
// // // // // // // //       return handleError(res, error)
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   async createScale(req, res) {
// // // // // // // //     try {
// // // // // // // //       console.log("Datos recibidos para crear escala:", JSON.stringify(req.body, null, 2))

// // // // // // // //       // Limpiar y preparar los datos
// // // // // // // //       const scaleData = {
// // // // // // // //         ...req.body,
// // // // // // // //         // Asegurar que las fechas sean válidas
// // // // // // // //         fechaInicial: req.body.fechaInicial ? new Date(req.body.fechaInicial) : new Date(),
// // // // // // // //         fechaFinal: req.body.fechaFinal ? new Date(req.body.fechaFinal) : new Date(),
// // // // // // // //         // Asegurar que el porcentaje sea número
// // // // // // // //         apruebaPorcentaje: Number(req.body.apruebaPorcentaje) || 70,
// // // // // // // //         // Manejar creado_por de forma segura
// // // // // // // //         creado_por: "sistema", // Valor por defecto
// // // // // // // //       }

// // // // // // // //       // Validar y limpiar métricas si existen
// // // // // // // //       if (scaleData.metricas && Array.isArray(scaleData.metricas)) {
// // // // // // // //         scaleData.metricas = scaleData.metricas.filter((metrica) => {
// // // // // // // //           // Solo incluir métricas que tengan los campos requeridos
// // // // // // // //           return metrica.concepto && typeof metrica.rangoInicial === "number" && typeof metrica.rangoFinal === "number"
// // // // // // // //         })
// // // // // // // //       } else {
// // // // // // // //         scaleData.metricas = []
// // // // // // // //       }

// // // // // // // //       console.log("Datos procesados para crear escala:", JSON.stringify(scaleData, null, 2))

// // // // // // // //       const newScale = await ScaleService.createScale(scaleData)

// // // // // // // //       console.log("Escala creada exitosamente:", newScale._id)

// // // // // // // //       return successResponse(res, "Escala de valoración creada exitosamente", newScale, 201)
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error detallado en createScale:", error)
// // // // // // // //       console.error("Stack trace:", error.stack)
// // // // // // // //       return handleError(res, error)
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   async updateScale(req, res) {
// // // // // // // //     try {
// // // // // // // //       const { id } = req.params
// // // // // // // //       console.log("=== ACTUALIZAR ESCALA ===")
// // // // // // // //       console.log("ID:", id)
// // // // // // // //       console.log("Datos recibidos:", JSON.stringify(req.body, null, 2))

// // // // // // // //       // Limpiar datos - remover campos que no deben actualizarse y campos null
// // // // // // // //       const updateData = { ...req.body }
// // // // // // // //       delete updateData._id
// // // // // // // //       delete updateData.__v
// // // // // // // //       delete updateData.fecha_creacion
// // // // // // // //       delete updateData.fecha_actualizacion
// // // // // // // //       delete updateData.createdAt
// // // // // // // //       delete updateData.updatedAt

// // // // // // // //       // Remover campos null o undefined
// // // // // // // //       Object.keys(updateData).forEach((key) => {
// // // // // // // //         if (updateData[key] === null || updateData[key] === undefined) {
// // // // // // // //           delete updateData[key]
// // // // // // // //         }
// // // // // // // //       })

// // // // // // // //       // Convertir fechas si vienen como string y validar
// // // // // // // //       if (updateData.fechaInicial) {
// // // // // // // //         updateData.fechaInicial = new Date(updateData.fechaInicial)
// // // // // // // //         console.log("Fecha inicial convertida:", updateData.fechaInicial)
// // // // // // // //       }
// // // // // // // //       if (updateData.fechaFinal) {
// // // // // // // //         updateData.fechaFinal = new Date(updateData.fechaFinal)
// // // // // // // //         console.log("Fecha final convertida:", updateData.fechaFinal)
// // // // // // // //       }

// // // // // // // //       // Validar fechas antes de enviar a MongoDB
// // // // // // // //       if (updateData.fechaInicial && updateData.fechaFinal) {
// // // // // // // //         const fechaInicial = new Date(updateData.fechaInicial)
// // // // // // // //         const fechaFinal = new Date(updateData.fechaFinal)

// // // // // // // //         fechaInicial.setHours(0, 0, 0, 0)
// // // // // // // //         fechaFinal.setHours(0, 0, 0, 0)

// // // // // // // //         console.log("Comparando fechas:")
// // // // // // // //         console.log("Fecha inicial (normalizada):", fechaInicial)
// // // // // // // //         console.log("Fecha final (normalizada):", fechaFinal)

// // // // // // // //         if (fechaFinal < fechaInicial) {
// // // // // // // //           return errorResponse(res, "La fecha final debe ser igual o posterior a la fecha inicial", 400)
// // // // // // // //         }
// // // // // // // //       }

// // // // // // // //       // Asegurar que el porcentaje sea número
// // // // // // // //       if (updateData.apruebaPorcentaje) {
// // // // // // // //         updateData.apruebaPorcentaje = Number(updateData.apruebaPorcentaje)
// // // // // // // //       }

// // // // // // // //       // Validar y limpiar métricas si existen
// // // // // // // //       if (updateData.metricas && Array.isArray(updateData.metricas)) {
// // // // // // // //         updateData.metricas = updateData.metricas.filter((metrica) => {
// // // // // // // //           return metrica.concepto && typeof metrica.rangoInicial === "number" && typeof metrica.rangoFinal === "number"
// // // // // // // //         })
// // // // // // // //       }

// // // // // // // //       console.log("Datos procesados para actualizar:", JSON.stringify(updateData, null, 2))

// // // // // // // //       const updatedScale = await ScaleService.updateScale(id, updateData)

// // // // // // // //       if (!updatedScale) {
// // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // //       }

// // // // // // // //       return successResponse(res, "Escala de valoración actualizada exitosamente", updatedScale)
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error en updateScale:", error)
// // // // // // // //       return handleError(res, error)
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   async deleteScale(req, res) {
// // // // // // // //     try {
// // // // // // // //       const { id } = req.params

// // // // // // // //       const deleted = await ScaleService.deleteScale(id)

// // // // // // // //       if (!deleted) {
// // // // // // // //         return errorResponse(res, "Escala de valoración no encontrada", 404)
// // // // // // // //       }

// // // // // // // //       return successResponse(res, "Escala de valoración eliminada exitosamente")
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error en deleteScale:", error)
// // // // // // // //       return handleError(res, error)
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   async addMetric(req, res) {
// // // // // // // //     try {
// // // // // // // //       const { id } = req.params
// // // // // // // //       const metricData = { ...req.body }

// // // // // // // //       const newMetric = await ScaleService.addMetric(id, metricData)

// // // // // // // //       return successResponse(res, "Métrica agregada exitosamente", newMetric, 201)
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error en addMetric:", error)
// // // // // // // //       return handleError(res, error)
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   async updateMetric(req, res) {
// // // // // // // //     try {
// // // // // // // //       const { id, metricId } = req.params
// // // // // // // //       const updateData = req.body

// // // // // // // //       const updatedMetric = await ScaleService.updateMetric(id, metricId, updateData)

// // // // // // // //       if (!updatedMetric) {
// // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // //       }

// // // // // // // //       return successResponse(res, "Métrica actualizada exitosamente", updatedMetric)
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error en updateMetric:", error)
// // // // // // // //       return handleError(res, error)
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   async deleteMetric(req, res) {
// // // // // // // //     try {
// // // // // // // //       const { metricId } = req.params

// // // // // // // //       const deleted = await ScaleService.deleteMetric(metricId)

// // // // // // // //       if (!deleted) {
// // // // // // // //         return errorResponse(res, "Métrica no encontrada", 404)
// // // // // // // //       }

// // // // // // // //       return successResponse(res, "Métrica eliminada exitosamente")
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Error en deleteMetric:", error)
// // // // // // // //       return handleError(res, error)
// // // // // // // //     }
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // module.exports = new ScaleController()
// // // // // // // // src/controllers/scaleController.js
// // // // // // // import Scale from "../models/Scale.js";
// // // // // // // import { Op, Sequelize } from "sequelize";

// // // // // // // // Obtener todas las escalas con paginación y filtros
// // // // // // // export const getScales = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const {
// // // // // // //       page = 1,
// // // // // // //       limit = 10,
// // // // // // //       search = "",
// // // // // // //       estado = "activo",
// // // // // // //       valoracion = "",
// // // // // // //       fechaInicial = "",
// // // // // // //       fechaFinal = "",
// // // // // // //     } = req.query;

// // // // // // //     const offset = (page - 1) * limit;

// // // // // // //     const whereClause = { estado };

// // // // // // //     if (search) {
// // // // // // //       whereClause[Op.or] = [
// // // // // // //         { descripcion: { [Op.iLike]: `%${search}%` } },
// // // // // // //         { valoracion: { [Op.iLike]: `%${search}%` } },
// // // // // // //       ];
// // // // // // //     }

// // // // // // //     if (valoracion) {
// // // // // // //       whereClause.valoracion = valoracion;
// // // // // // //     }

// // // // // // //     if (fechaInicial && fechaFinal) {
// // // // // // //       whereClause.fechaInicial = { [Op.between]: [fechaInicial, fechaFinal] };
// // // // // // //     }

// // // // // // //     const { count, rows } = await Scale.findAndCountAll({
// // // // // // //       where: whereClause,
// // // // // // //       limit: parseInt(limit),
// // // // // // //       offset: parseInt(offset),
// // // // // // //       order: [["createdAt", "DESC"]],
// // // // // // //     });

// // // // // // //     res.json({
// // // // // // //       success: true,
// // // // // // //       data: rows,
// // // // // // //       pagination: {
// // // // // // //         total: count,
// // // // // // //         page: parseInt(page),
// // // // // // //         limit: parseInt(limit),
// // // // // // //         totalPages: Math.ceil(count / limit),
// // // // // // //       },
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     res.status(500).json({
// // // // // // //       success: false,
// // // // // // //       message: "Error interno del servidor",
// // // // // // //       error: error.message,
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // export const getScaleById = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const { id } = req.params;

// // // // // // //     const scale = await Scale.findOne({
// // // // // // //       where: { id, estado: "activo" },
// // // // // // //     });

// // // // // // //     if (!scale) {
// // // // // // //       return res.status(404).json({
// // // // // // //         success: false,
// // // // // // //         message: "Escala de valoración no encontrada",
// // // // // // //       });
// // // // // // //     }

// // // // // // //     res.json({ success: true, data: scale });
// // // // // // //   } catch (error) {
// // // // // // //     res.status(500).json({
// // // // // // //       success: false,
// // // // // // //       message: "Error interno del servidor",
// // // // // // //       error: error.message,
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // export const createScale = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const {
// // // // // // //       fechaInicial,
// // // // // // //       fechaFinal,
// // // // // // //       rangoInicial,
// // // // // // //       rangoFinal,
// // // // // // //       valoracion,
// // // // // // //       descripcion,
// // // // // // //       apruebaPorcentaje,
// // // // // // //       metricas,
// // // // // // //     } = req.body;

// // // // // // //     if (!fechaInicial || !fechaFinal) {
// // // // // // //       return res.status(400).json({ success: false, message: "Las fechas inicial y final son requeridas" });
// // // // // // //     }

// // // // // // //     if (rangoInicial === undefined || rangoFinal === undefined) {
// // // // // // //       return res.status(400).json({ success: false, message: "Los rangos son requeridos" });
// // // // // // //     }

// // // // // // //     if (apruebaPorcentaje === undefined) {
// // // // // // //       return res.status(400).json({ success: false, message: "El porcentaje de aprobación es requerido" });
// // // // // // //     }

// // // // // // //     const existingScale = await Scale.findOne({
// // // // // // //       where: {
// // // // // // //         estado: "activo",
// // // // // // //         [Op.or]: [
// // // // // // //           { fechaInicial: { [Op.between]: [fechaInicial, fechaFinal] } },
// // // // // // //           { fechaFinal: { [Op.between]: [fechaInicial, fechaFinal] } },
// // // // // // //           {
// // // // // // //             [Op.and]: [
// // // // // // //               { fechaInicial: { [Op.lte]: fechaInicial } },
// // // // // // //               { fechaFinal: { [Op.gte]: fechaFinal } },
// // // // // // //             ],
// // // // // // //           },
// // // // // // //         ],
// // // // // // //       },
// // // // // // //     });

// // // // // // //     if (existingScale) {
// // // // // // //       return res.status(400).json({
// // // // // // //         success: false,
// // // // // // //         message: "Ya existe una escala activa en ese rango de fechas",
// // // // // // //       });
// // // // // // //     }

// // // // // // //     const newScale = await Scale.create({
// // // // // // //       fechaInicial,
// // // // // // //       fechaFinal,
// // // // // // //       rangoInicial,
// // // // // // //       rangoFinal,
// // // // // // //       valoracion,
// // // // // // //       descripcion,
// // // // // // //       apruebaPorcentaje,
// // // // // // //       metricas: metricas || [],
// // // // // // //     });

// // // // // // //     res.status(201).json({
// // // // // // //       success: true,
// // // // // // //       message: "Escala creada exitosamente",
// // // // // // //       data: newScale,
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     if (error.name === "SequelizeValidationError") {
// // // // // // //       return res.status(400).json({
// // // // // // //         success: false,
// // // // // // //         message: "Error de validación",
// // // // // // //         errors: error.errors.map((e) => ({ field: e.path, message: e.message })),
// // // // // // //       });
// // // // // // //     }

// // // // // // //     res.status(500).json({ success: false, message: "Error interno", error: error.message });
// // // // // // //   }
// // // // // // // };

// // // // // // // export const updateScale = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const { id } = req.params;
// // // // // // //     const {
// // // // // // //       fechaInicial,
// // // // // // //       fechaFinal,
// // // // // // //       rangoInicial,
// // // // // // //       rangoFinal,
// // // // // // //       valoracion,
// // // // // // //       descripcion,
// // // // // // //       apruebaPorcentaje,
// // // // // // //       metricas,
// // // // // // //     } = req.body;

// // // // // // //     const scale = await Scale.findOne({ where: { id, estado: "activo" } });

// // // // // // //     if (!scale) {
// // // // // // //       return res.status(404).json({
// // // // // // //         success: false,
// // // // // // //         message: "Escala no encontrada",
// // // // // // //       });
// // // // // // //     }

// // // // // // //     if (fechaInicial && fechaFinal) {
// // // // // // //       const existingScale = await Scale.findOne({
// // // // // // //         where: {
// // // // // // //           id: { [Op.ne]: id },
// // // // // // //           estado: "activo",
// // // // // // //           [Op.or]: [
// // // // // // //             { fechaInicial: { [Op.between]: [fechaInicial, fechaFinal] } },
// // // // // // //             { fechaFinal: { [Op.between]: [fechaInicial, fechaFinal] } },
// // // // // // //             {
// // // // // // //               [Op.and]: [
// // // // // // //                 { fechaInicial: { [Op.lte]: fechaInicial } },
// // // // // // //                 { fechaFinal: { [Op.gte]: fechaFinal } },
// // // // // // //               ],
// // // // // // //             },
// // // // // // //           ],
// // // // // // //         },
// // // // // // //       });

// // // // // // //       if (existingScale) {
// // // // // // //         return res.status(400).json({
// // // // // // //           success: false,
// // // // // // //           message: "Ya existe otra escala activa en ese rango de fechas",
// // // // // // //         });
// // // // // // //       }
// // // // // // //     }

// // // // // // //     const updatedScale = await scale.update({
// // // // // // //       fechaInicial: fechaInicial || scale.fechaInicial,
// // // // // // //       fechaFinal: fechaFinal || scale.fechaFinal,
// // // // // // //       rangoInicial: rangoInicial !== undefined ? rangoInicial : scale.rangoInicial,
// // // // // // //       rangoFinal: rangoFinal !== undefined ? rangoFinal : scale.rangoFinal,
// // // // // // //       valoracion: valoracion || scale.valoracion,
// // // // // // //       descripcion: descripcion !== undefined ? descripcion : scale.descripcion,
// // // // // // //       apruebaPorcentaje: apruebaPorcentaje !== undefined ? apruebaPorcentaje : scale.apruebaPorcentaje,
// // // // // // //       metricas: metricas !== undefined ? metricas : scale.metricas,
// // // // // // //     });

// // // // // // //     res.json({
// // // // // // //       success: true,
// // // // // // //       message: "Escala actualizada exitosamente",
// // // // // // //       data: updatedScale,
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     if (error.name === "SequelizeValidationError") {
// // // // // // //       return res.status(400).json({
// // // // // // //         success: false,
// // // // // // //         message: "Error de validación",
// // // // // // //         errors: error.errors.map((e) => ({ field: e.path, message: e.message })),
// // // // // // //       });
// // // // // // //     }

// // // // // // //     res.status(500).json({ success: false, message: "Error interno", error: error.message });
// // // // // // //   }
// // // // // // // };

// // // // // // // export const deleteScale = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const { id } = req.params;

// // // // // // //     const scale = await Scale.findOne({ where: { id, estado: "activo" } });

// // // // // // //     if (!scale) {
// // // // // // //       return res.status(404).json({
// // // // // // //         success: false,
// // // // // // //         message: "Escala no encontrada",
// // // // // // //       });
// // // // // // //     }

// // // // // // //     await scale.update({ estado: "inactivo" });

// // // // // // //     res.json({
// // // // // // //       success: true,
// // // // // // //       message: "Escala eliminada exitosamente",
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     res.status(500).json({
// // // // // // //       success: false,
// // // // // // //       message: "Error interno",
// // // // // // //       error: error.message,
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // export const getScaleStats = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const totalScales = await Scale.count({ where: { estado: "activo" } });

// // // // // // //     const scalesByValoracion = await Scale.findAll({
// // // // // // //       where: { estado: "activo" },
// // // // // // //       attributes: ["valoracion", [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
// // // // // // //       group: ["valoracion"],
// // // // // // //       raw: true,
// // // // // // //     });

// // // // // // //     const activeScales = await Scale.count({
// // // // // // //       where: {
// // // // // // //         estado: "activo",
// // // // // // //         fechaInicial: { [Op.lte]: new Date() },
// // // // // // //         fechaFinal: { [Op.gte]: new Date() },
// // // // // // //       },
// // // // // // //     });

// // // // // // //     const stats = {
// // // // // // //       total: totalScales,
// // // // // // //       activas: activeScales,
// // // // // // //       porValoracion: scalesByValoracion.reduce((acc, item) => {
// // // // // // //         acc[item.valoracion] = parseInt(item.count);
// // // // // // //         return acc;
// // // // // // //       }, {}),
// // // // // // //     };

// // // // // // //     res.json({
// // // // // // //       success: true,
// // // // // // //       data: stats,
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     res.status(500).json({
// // // // // // //       success: false,
// // // // // // //       message: "Error interno",
// // // // // // //       error: error.message,
// // // // // // //     });
// // // // // // //   }
// // // // // // // };
// // // // // // import Scale from "../models/Scale.js"
// // // // // // import { handleError } from "../utils/errorHandler.js"
// // // // // // import { successResponse, errorResponse } from "../utils/responseHandler.js"

// // // // // // // Obtener todas las escalas con paginación y filtros
// // // // // // export const getScales = async (req, res) => {
// // // // // //   try {
// // // // // //     const { page = 1, limit = 10, estado, valoracion, fechaInicial, fechaFinal, search } = req.query

// // // // // //     // Construir filtros
// // // // // //     const filters = {}

// // // // // //     if (estado) filters.estado = estado
// // // // // //     if (valoracion) filters.valoracion = valoracion

// // // // // //     // Filtro por rango de fechas
// // // // // //     if (fechaInicial || fechaFinal) {
// // // // // //       filters.$and = []
// // // // // //       if (fechaInicial) {
// // // // // //         filters.$and.push({ fechaInicial: { $gte: new Date(fechaInicial) } })
// // // // // //       }
// // // // // //       if (fechaFinal) {
// // // // // //         filters.$and.push({ fechaFinal: { $lte: new Date(fechaFinal) } })
// // // // // //       }
// // // // // //     }

// // // // // //     // Búsqueda por texto en descripción
// // // // // //     if (search) {
// // // // // //       filters.$or = [
// // // // // //         { descripcion: { $regex: search, $options: "i" } },
// // // // // //         { valoracion: { $regex: search, $options: "i" } },
// // // // // //       ]
// // // // // //     }

// // // // // //     // Paginación
// // // // // //     const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

// // // // // //     // Ejecutar consultas
// // // // // //     const [scales, total] = await Promise.all([
// // // // // //       Scale.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit)).lean(),
// // // // // //       Scale.countDocuments(filters),
// // // // // //     ])

// // // // // //     // Calcular estadísticas adicionales
// // // // // //     const stats = await Scale.aggregate([
// // // // // //       { $match: filters },
// // // // // //       {
// // // // // //         $group: {
// // // // // //           _id: null,
// // // // // //           totalActivas: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
// // // // // //           totalInactivas: { $sum: { $cond: [{ $eq: ["$estado", "inactivo"] }, 1, 0] } },
// // // // // //           promedioAprobacion: { $avg: "$apruebaPorcentaje" },
// // // // // //           rangoPromedioInicial: { $avg: "$rangoInicial" },
// // // // // //           rangoPromedioFinal: { $avg: "$rangoFinal" },
// // // // // //         },
// // // // // //       },
// // // // // //     ])

// // // // // //     const response = {
// // // // // //       scales,
// // // // // //       pagination: {
// // // // // //         currentPage: Number.parseInt(page),
// // // // // //         totalPages: Math.ceil(total / Number.parseInt(limit)),
// // // // // //         totalItems: total,
// // // // // //         itemsPerPage: Number.parseInt(limit),
// // // // // //         hasNextPage: Number.parseInt(page) < Math.ceil(total / Number.parseInt(limit)),
// // // // // //         hasPrevPage: Number.parseInt(page) > 1,
// // // // // //       },
// // // // // //       stats: stats[0] || {
// // // // // //         totalActivas: 0,
// // // // // //         totalInactivas: 0,
// // // // // //         promedioAprobacion: 0,
// // // // // //         rangoPromedioInicial: 0,
// // // // // //         rangoPromedioFinal: 0,
// // // // // //       },
// // // // // //     }

// // // // // //     return successResponse(res, response, "Escalas obtenidas exitosamente")
// // // // // //   } catch (error) {
// // // // // //     console.error("Error al obtener escalas:", error)
// // // // // //     return handleError(res, error)
// // // // // //   }
// // // // // // }

// // // // // // // Obtener escala por ID
// // // // // // export const getScaleById = async (req, res) => {
// // // // // //   try {
// // // // // //     const { id } = req.params

// // // // // //     const scale = await Scale.findById(id)

// // // // // //     if (!scale) {
// // // // // //       return errorResponse(res, "Escala no encontrada", 404)
// // // // // //     }

// // // // // //     // Agregar estadísticas de la escala
// // // // // //     const scaleWithStats = {
// // // // // //       ...scale.toObject(),
// // // // // //       stats: scale.getStats(),
// // // // // //     }

// // // // // //     return successResponse(res, scaleWithStats, "Escala obtenida exitosamente")
// // // // // //   } catch (error) {
// // // // // //     console.error("Error al obtener escala:", error)
// // // // // //     return handleError(res, error)
// // // // // //   }
// // // // // // }

// // // // // // // Crear nueva escala
// // // // // // export const createScale = async (req, res) => {
// // // // // //   try {
// // // // // //     const scaleData = req.body

// // // // // //     // Validar que las fechas sean válidas
// // // // // //     if (scaleData.fechaInicial) {
// // // // // //       scaleData.fechaInicial = new Date(scaleData.fechaInicial)
// // // // // //     }
// // // // // //     if (scaleData.fechaFinal) {
// // // // // //       scaleData.fechaFinal = new Date(scaleData.fechaFinal)
// // // // // //     }

// // // // // //     const newScale = new Scale(scaleData)
// // // // // //     const savedScale = await newScale.save()

// // // // // //     return successResponse(res, savedScale, "Escala creada exitosamente", 201)
// // // // // //   } catch (error) {
// // // // // //     console.error("Error al crear escala:", error)
// // // // // //     return handleError(res, error)
// // // // // //   }
// // // // // // }

// // // // // // // Actualizar escala
// // // // // // export const updateScale = async (req, res) => {
// // // // // //   try {
// // // // // //     const { id } = req.params
// // // // // //     const updateData = req.body

// // // // // //     // Validar que las fechas sean válidas si se proporcionan
// // // // // //     if (updateData.fechaInicial) {
// // // // // //       updateData.fechaInicial = new Date(updateData.fechaInicial)
// // // // // //     }
// // // // // //     if (updateData.fechaFinal) {
// // // // // //       updateData.fechaFinal = new Date(updateData.fechaFinal)
// // // // // //     }

// // // // // //     const updatedScale = await Scale.findByIdAndUpdate(id, updateData, {
// // // // // //       new: true,
// // // // // //       runValidators: true,
// // // // // //       context: "query",
// // // // // //     })

// // // // // //     if (!updatedScale) {
// // // // // //       return errorResponse(res, "Escala no encontrada", 404)
// // // // // //     }

// // // // // //     return successResponse(res, updatedScale, "Escala actualizada exitosamente")
// // // // // //   } catch (error) {
// // // // // //     console.error("Error al actualizar escala:", error)
// // // // // //     return handleError(res, error)
// // // // // //   }
// // // // // // }

// // // // // // // Eliminar escala (soft delete)
// // // // // // export const deleteScale = async (req, res) => {
// // // // // //   try {
// // // // // //     const { id } = req.params

// // // // // //     const deletedScale = await Scale.findByIdAndUpdate(id, { estado: "inactivo" }, { new: true })

// // // // // //     if (!deletedScale) {
// // // // // //       return errorResponse(res, "Escala no encontrada", 404)
// // // // // //     }

// // // // // //     return successResponse(res, deletedScale, "Escala eliminada exitosamente")
// // // // // //   } catch (error) {
// // // // // //     console.error("Error al eliminar escala:", error)
// // // // // //     return handleError(res, error)
// // // // // //   }
// // // // // // }

// // // // // // // Obtener escala vigente para una fecha específica
// // // // // // export const getActiveScaleByDate = async (req, res) => {
// // // // // //   try {
// // // // // //     const { date } = req.query
// // // // // //     const searchDate = date ? new Date(date) : new Date()

// // // // // //     const scale = await Scale.findByDate(searchDate)

// // // // // //     if (!scale) {
// // // // // //       return errorResponse(res, "No hay escala vigente para la fecha especificada", 404)
// // // // // //     }

// // // // // //     return successResponse(res, scale, "Escala vigente obtenida exitosamente")
// // // // // //   } catch (error) {
// // // // // //     console.error("Error al obtener escala vigente:", error)
// // // // // //     return handleError(res, error)
// // // // // //   }
// // // // // // }

// // // // // // // Evaluar una calificación con la escala vigente
// // // // // // export const evaluateScore = async (req, res) => {
// // // // // //   try {
// // // // // //     const { score, date } = req.body

// // // // // //     if (score === undefined || score === null) {
// // // // // //       return errorResponse(res, "La calificación es requerida", 400)
// // // // // //     }

// // // // // //     const searchDate = date ? new Date(date) : new Date()
// // // // // //     const scale = await Scale.findByDate(searchDate)

// // // // // //     if (!scale) {
// // // // // //       return errorResponse(res, "No hay escala vigente para evaluar la calificación", 404)
// // // // // //     }

// // // // // //     const evaluation = scale.evaluateScore(score)

// // // // // //     return successResponse(
// // // // // //       res,
// // // // // //       {
// // // // // //         calificacion: score,
// // // // // //         fecha: searchDate,
// // // // // //         escala: {
// // // // // //           id: scale._id,
// // // // // //           rango: `${scale.rangoInicial}-${scale.rangoFinal}`,
// // // // // //           porcentajeAprobacion: scale.apruebaPorcentaje,
// // // // // //         },
// // // // // //         resultado: evaluation,
// // // // // //       },
// // // // // //       "Calificación evaluada exitosamente",
// // // // // //     )
// // // // // //   } catch (error) {
// // // // // //     console.error("Error al evaluar calificación:", error)
// // // // // //     return handleError(res, error)
// // // // // //   }
// // // // // // }

// // // // // // // Obtener estadísticas generales
// // // // // // export const getScaleStats = async (req, res) => {
// // // // // //   try {
// // // // // //     const stats = await Scale.aggregate([
// // // // // //       {
// // // // // //         $group: {
// // // // // //           _id: null,
// // // // // //           totalEscalas: { $sum: 1 },
// // // // // //           escalasActivas: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
// // // // // //           escalasInactivas: { $sum: { $cond: [{ $eq: ["$estado", "inactivo"] }, 1, 0] } },
// // // // // //           promedioAprobacion: { $avg: "$apruebaPorcentaje" },
// // // // // //           rangoMinimoPromedio: { $avg: "$rangoInicial" },
// // // // // //           rangoMaximoPromedio: { $avg: "$rangoFinal" },
// // // // // //           totalMetricas: { $sum: { $size: "$metricas" } },
// // // // // //         },
// // // // // //       },
// // // // // //     ])

// // // // // //     const currentScale = await Scale.findByDate(new Date())

// // // // // //     const response = {
// // // // // //       estadisticas: stats[0] || {
// // // // // //         totalEscalas: 0,
// // // // // //         escalasActivas: 0,
// // // // // //         escalasInactivas: 0,
// // // // // //         promedioAprobacion: 0,
// // // // // //         rangoMinimoPromedio: 0,
// // // // // //         rangoMaximoPromedio: 0,
// // // // // //         totalMetricas: 0,
// // // // // //       },
// // // // // //       escalaVigente: currentScale
// // // // // //         ? {
// // // // // //             id: currentScale._id,
// // // // // //             rango: `${currentScale.rangoInicial}-${currentScale.rangoFinal}`,
// // // // // //             porcentajeAprobacion: currentScale.apruebaPorcentaje,
// // // // // //             vigencia: `${currentScale.fechaInicial.toISOString().split("T")[0]} - ${currentScale.fechaFinal.toISOString().split("T")[0]}`,
// // // // // //           }
// // // // // //         : null,
// // // // // //     }

// // // // // //     return successResponse(res, response, "Estadísticas obtenidas exitosamente")
// // // // // //   } catch (error) {
// // // // // //     console.error("Error al obtener estadísticas:", error)
// // // // // //     return handleError(res, error)
// // // // // //   }
// // // // // // }
// // // // // import Scale from "../models/Scale.js"
// // // // // import { handleError } from "../utils/errorHandler.js"
// // // // // import { successResponse, errorResponse } from "../utils/responseHandler.js"

// // // // // // Obtener todas las escalas con paginación y filtros
// // // // // export const getScales = async (req, res) => {
// // // // //   try {
// // // // //     const { page = 1, limit = 10, estado, valoracion, fechaInicial, fechaFinal, search } = req.query

// // // // //     // Construir filtros
// // // // //     const filters = {}

// // // // //     if (estado) filters.estado = estado
// // // // //     if (valoracion) filters.valoracion = valoracion

// // // // //     // Filtro por rango de fechas
// // // // //     if (fechaInicial || fechaFinal) {
// // // // //       filters.$and = []
// // // // //       if (fechaInicial) {
// // // // //         filters.$and.push({ fechaInicial: { $gte: new Date(fechaInicial) } })
// // // // //       }
// // // // //       if (fechaFinal) {
// // // // //         filters.$and.push({ fechaFinal: { $lte: new Date(fechaFinal) } })
// // // // //       }
// // // // //     }

// // // // //     // Búsqueda por texto en descripción
// // // // //     if (search) {
// // // // //       filters.$or = [
// // // // //         { descripcion: { $regex: search, $options: "i" } },
// // // // //         { valoracion: { $regex: search, $options: "i" } },
// // // // //       ]
// // // // //     }

// // // // //     // Paginación
// // // // //     const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

// // // // //     // Ejecutar consultas
// // // // //     const [scales, total] = await Promise.all([
// // // // //       Scale.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit)).lean(),
// // // // //       Scale.countDocuments(filters),
// // // // //     ])

// // // // //     // Calcular estadísticas adicionales
// // // // //     const stats = await Scale.aggregate([
// // // // //       { $match: filters },
// // // // //       {
// // // // //         $group: {
// // // // //           _id: null,
// // // // //           totalActivas: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
// // // // //           totalInactivas: { $sum: { $cond: [{ $eq: ["$estado", "inactivo"] }, 1, 0] } },
// // // // //           promedioAprobacion: { $avg: "$apruebaPorcentaje" },
// // // // //           rangoPromedioInicial: { $avg: "$rangoInicial" },
// // // // //           rangoPromedioFinal: { $avg: "$rangoFinal" },
// // // // //         },
// // // // //       },
// // // // //     ])

// // // // //     const response = {
// // // // //       scales,
// // // // //       pagination: {
// // // // //         currentPage: Number.parseInt(page),
// // // // //         totalPages: Math.ceil(total / Number.parseInt(limit)),
// // // // //         totalItems: total,
// // // // //         itemsPerPage: Number.parseInt(limit),
// // // // //         hasNextPage: Number.parseInt(page) < Math.ceil(total / Number.parseInt(limit)),
// // // // //         hasPrevPage: Number.parseInt(page) > 1,
// // // // //       },
// // // // //       stats: stats[0] || {
// // // // //         totalActivas: 0,
// // // // //         totalInactivas: 0,
// // // // //         promedioAprobacion: 0,
// // // // //         rangoPromedioInicial: 0,
// // // // //         rangoPromedioFinal: 0,
// // // // //       },
// // // // //     }

// // // // //     return successResponse(res, response, "Escalas obtenidas exitosamente")
// // // // //   } catch (error) {
// // // // //     console.error("Error al obtener escalas:", error)
// // // // //     return handleError(res, error)
// // // // //   }
// // // // // }

// // // // // // Obtener escala por ID
// // // // // export const getScaleById = async (req, res) => {
// // // // //   try {
// // // // //     const { id } = req.params

// // // // //     const scale = await Scale.findById(id)

// // // // //     if (!scale) {
// // // // //       return errorResponse(res, "Escala no encontrada", 404)
// // // // //     }

// // // // //     // Agregar estadísticas de la escala
// // // // //     const scaleWithStats = {
// // // // //       ...scale.toObject(),
// // // // //       stats: scale.getStats(),
// // // // //     }

// // // // //     return successResponse(res, scaleWithStats, "Escala obtenida exitosamente")
// // // // //   } catch (error) {
// // // // //     console.error("Error al obtener escala:", error)
// // // // //     return handleError(res, error)
// // // // //   }
// // // // // }

// // // // // // Crear nueva escala
// // // // // export const createScale = async (req, res) => {
// // // // //   try {
// // // // //     const scaleData = req.body

// // // // //     // Validar que las fechas sean válidas
// // // // //     if (scaleData.fechaInicial) {
// // // // //       scaleData.fechaInicial = new Date(scaleData.fechaInicial)
// // // // //     }
// // // // //     if (scaleData.fechaFinal) {
// // // // //       scaleData.fechaFinal = new Date(scaleData.fechaFinal)
// // // // //     }

// // // // //     const newScale = new Scale(scaleData)
// // // // //     const savedScale = await newScale.save()

// // // // //     return successResponse(res, savedScale, "Escala creada exitosamente", 201)
// // // // //   } catch (error) {
// // // // //     console.error("Error al crear escala:", error)
// // // // //     return handleError(res, error)
// // // // //   }
// // // // // }

// // // // // // Actualizar escala
// // // // // export const updateScale = async (req, res) => {
// // // // //   try {
// // // // //     const { id } = req.params
// // // // //     const updateData = req.body

// // // // //     // Validar que las fechas sean válidas si se proporcionan
// // // // //     if (updateData.fechaInicial) {
// // // // //       updateData.fechaInicial = new Date(updateData.fechaInicial)
// // // // //     }
// // // // //     if (updateData.fechaFinal) {
// // // // //       updateData.fechaFinal = new Date(updateData.fechaFinal)
// // // // //     }

// // // // //     const updatedScale = await Scale.findByIdAndUpdate(id, updateData, {
// // // // //       new: true,
// // // // //       runValidators: true,
// // // // //       context: "query",
// // // // //     })

// // // // //     if (!updatedScale) {
// // // // //       return errorResponse(res, "Escala no encontrada", 404)
// // // // //     }

// // // // //     return successResponse(res, updatedScale, "Escala actualizada exitosamente")
// // // // //   } catch (error) {
// // // // //     console.error("Error al actualizar escala:", error)
// // // // //     return handleError(res, error)
// // // // //   }
// // // // // }

// // // // // // Eliminar escala (soft delete)
// // // // // export const deleteScale = async (req, res) => {
// // // // //   try {
// // // // //     const { id } = req.params

// // // // //     const deletedScale = await Scale.findByIdAndUpdate(id, { estado: "inactivo" }, { new: true })

// // // // //     if (!deletedScale) {
// // // // //       return errorResponse(res, "Escala no encontrada", 404)
// // // // //     }

// // // // //     return successResponse(res, deletedScale, "Escala eliminada exitosamente")
// // // // //   } catch (error) {
// // // // //     console.error("Error al eliminar escala:", error)
// // // // //     return handleError(res, error)
// // // // //   }
// // // // // }

// // // // // // Obtener escala vigente para una fecha específica
// // // // // export const getActiveScaleByDate = async (req, res) => {
// // // // //   try {
// // // // //     const { date } = req.query
// // // // //     const searchDate = date ? new Date(date) : new Date()

// // // // //     const scale = await Scale.findByDate(searchDate)

// // // // //     if (!scale) {
// // // // //       return errorResponse(res, "No hay escala vigente para la fecha especificada", 404)
// // // // //     }

// // // // //     return successResponse(res, scale, "Escala vigente obtenida exitosamente")
// // // // //   } catch (error) {
// // // // //     console.error("Error al obtener escala vigente:", error)
// // // // //     return handleError(res, error)
// // // // //   }
// // // // // }

// // // // // // Evaluar una calificación con la escala vigente
// // // // // export const evaluateScore = async (req, res) => {
// // // // //   try {
// // // // //     const { score, date } = req.body

// // // // //     if (score === undefined || score === null) {
// // // // //       return errorResponse(res, "La calificación es requerida", 400)
// // // // //     }

// // // // //     const searchDate = date ? new Date(date) : new Date()
// // // // //     const scale = await Scale.findByDate(searchDate)

// // // // //     if (!scale) {
// // // // //       return errorResponse(res, "No hay escala vigente para evaluar la calificación", 404)
// // // // //     }

// // // // //     const evaluation = scale.evaluateScore(score)

// // // // //     return successResponse(
// // // // //       res,
// // // // //       {
// // // // //         calificacion: score,
// // // // //         fecha: searchDate,
// // // // //         escala: {
// // // // //           id: scale._id,
// // // // //           rango: `${scale.rangoInicial}-${scale.rangoFinal}`,
// // // // //           porcentajeAprobacion: scale.apruebaPorcentaje,
// // // // //         },
// // // // //         resultado: evaluation,
// // // // //       },
// // // // //       "Calificación evaluada exitosamente",
// // // // //     )
// // // // //   } catch (error) {
// // // // //     console.error("Error al evaluar calificación:", error)
// // // // //     return handleError(res, error)
// // // // //   }
// // // // // }

// // // // // // Obtener estadísticas generales
// // // // // export const getScaleStats = async (req, res) => {
// // // // //   try {
// // // // //     const stats = await Scale.aggregate([
// // // // //       {
// // // // //         $group: {
// // // // //           _id: null,
// // // // //           totalEscalas: { $sum: 1 },
// // // // //           escalasActivas: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
// // // // //           escalasInactivas: { $sum: { $cond: [{ $eq: ["$estado", "inactivo"] }, 1, 0] } },
// // // // //           promedioAprobacion: { $avg: "$apruebaPorcentaje" },
// // // // //           rangoMinimoPromedio: { $avg: "$rangoInicial" },
// // // // //           rangoMaximoPromedio: { $avg: "$rangoFinal" },
// // // // //           totalMetricas: { $sum: { $size: "$metricas" } },
// // // // //         },
// // // // //       },
// // // // //     ])

// // // // //     const currentScale = await Scale.findByDate(new Date())

// // // // //     const response = {
// // // // //       estadisticas: stats[0] || {
// // // // //         totalEscalas: 0,
// // // // //         escalasActivas: 0,
// // // // //         escalasInactivas: 0,
// // // // //         promedioAprobacion: 0,
// // // // //         rangoMinimoPromedio: 0,
// // // // //         rangoMaximoPromedio: 0,
// // // // //         totalMetricas: 0,
// // // // //       },
// // // // //       escalaVigente: currentScale
// // // // //         ? {
// // // // //             id: currentScale._id,
// // // // //             rango: `${currentScale.rangoInicial}-${currentScale.rangoFinal}`,
// // // // //             porcentajeAprobacion: currentScale.apruebaPorcentaje,
// // // // //             vigencia: `${currentScale.fechaInicial.toISOString().split("T")[0]} - ${currentScale.fechaFinal.toISOString().split("T")[0]}`,
// // // // //           }
// // // // //         : null,
// // // // //     }

// // // // //     return successResponse(res, response, "Estadísticas obtenidas exitosamente")
// // // // //   } catch (error) {
// // // // //     console.error("Error al obtener estadísticas:", error)
// // // // //     return handleError(res, error)
// // // // //   }
// // // // // }
// // // // import Scale from "../models/Scale.js"
// // // // import { handleError } from "../utils/errorHandler.js"
// // // // import { successResponse, errorResponse } from "../utils/responseHandler.js"

// // // // // Obtener todas las escalas con paginación y filtros
// // // // export const getScales = async (req, res) => {
// // // //   try {
// // // //     const { page = 1, limit = 10, estado, valoracion, fechaInicial, fechaFinal, search } = req.query

// // // //     // Construir filtros
// // // //     const filters = {}

// // // //     if (estado) filters.estado = estado
// // // //     if (valoracion) filters.valoracion = valoracion

// // // //     // Filtro por rango de fechas
// // // //     if (fechaInicial || fechaFinal) {
// // // //       filters.$and = []
// // // //       if (fechaInicial) {
// // // //         filters.$and.push({ fechaInicial: { $gte: new Date(fechaInicial) } })
// // // //       }
// // // //       if (fechaFinal) {
// // // //         filters.$and.push({ fechaFinal: { $lte: new Date(fechaFinal) } })
// // // //       }
// // // //     }

// // // //     // Búsqueda por texto en descripción
// // // //     if (search) {
// // // //       filters.$or = [
// // // //         { descripcion: { $regex: search, $options: "i" } },
// // // //         { valoracion: { $regex: search, $options: "i" } },
// // // //       ]
// // // //     }

// // // //     // Paginación
// // // //     const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

// // // //     // Ejecutar consultas
// // // //     const [scales, total] = await Promise.all([
// // // //       Scale.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit)).lean(),
// // // //       Scale.countDocuments(filters),
// // // //     ])

// // // //     const response = {
// // // //       scales,
// // // //       pagination: {
// // // //         currentPage: Number.parseInt(page),
// // // //         totalPages: Math.ceil(total / Number.parseInt(limit)),
// // // //         totalItems: total,
// // // //         itemsPerPage: Number.parseInt(limit),
// // // //         hasNextPage: Number.parseInt(page) < Math.ceil(total / Number.parseInt(limit)),
// // // //         hasPrevPage: Number.parseInt(page) > 1,
// // // //       },
// // // //     }

// // // //     return successResponse(res, response, "Escalas obtenidas exitosamente")
// // // //   } catch (error) {
// // // //     console.error("Error al obtener escalas:", error)
// // // //     return handleError(res, error)
// // // //   }
// // // // }

// // // // // Obtener escala por ID
// // // // export const getScaleById = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params

// // // //     const scale = await Scale.findById(id)

// // // //     if (!scale) {
// // // //       return errorResponse(res, "Escala no encontrada", 404)
// // // //     }

// // // //     return successResponse(res, scale, "Escala obtenida exitosamente")
// // // //   } catch (error) {
// // // //     console.error("Error al obtener escala:", error)
// // // //     return handleError(res, error)
// // // //   }
// // // // }

// // // // // Crear nueva escala
// // // // export const createScale = async (req, res) => {
// // // //   try {
// // // //     console.log("📝 Datos recibidos para crear escala:", JSON.stringify(req.body, null, 2))

// // // //     const scaleData = { ...req.body }

// // // //     // Validar que las fechas sean válidas
// // // //     if (scaleData.fechaInicial) {
// // // //       scaleData.fechaInicial = new Date(scaleData.fechaInicial)
// // // //     }
// // // //     if (scaleData.fechaFinal) {
// // // //       scaleData.fechaFinal = new Date(scaleData.fechaFinal)
// // // //     }

// // // //     // Validar que apruebaPorcentaje sea un número
// // // //     if (scaleData.apruebaPorcentaje) {
// // // //       scaleData.apruebaPorcentaje = Number(scaleData.apruebaPorcentaje)
// // // //     }

// // // //     // Limpiar métricas - remover campos innecesarios como 'id'
// // // //     if (scaleData.metricas && Array.isArray(scaleData.metricas)) {
// // // //       scaleData.metricas = scaleData.metricas
// // // //         .map((metrica) => ({
// // // //           rangoInicial: Number(metrica.rangoInicial),
// // // //           rangoFinal: Number(metrica.rangoFinal),
// // // //           concepto: metrica.concepto,
// // // //           descripcion: metrica.descripcion || "",
// // // //         }))
// // // //         .filter(
// // // //           (metrica) =>
// // // //             metrica.concepto &&
// // // //             typeof metrica.rangoInicial === "number" &&
// // // //             typeof metrica.rangoFinal === "number" &&
// // // //             !isNaN(metrica.rangoInicial) &&
// // // //             !isNaN(metrica.rangoFinal),
// // // //         )
// // // //     }

// // // //     console.log("📤 Datos procesados para crear escala:", JSON.stringify(scaleData, null, 2))

// // // //     const newScale = new Scale(scaleData)
// // // //     const savedScale = await newScale.save()

// // // //     console.log("✅ Escala creada exitosamente:", savedScale._id)
// // // //     return successResponse(res, savedScale, "Escala creada exitosamente", 201)
// // // //   } catch (error) {
// // // //     console.error("❌ Error al crear escala:", error)

// // // //     if (error.name === "ValidationError") {
// // // //       const errors = Object.values(error.errors).map((err) => err.message)
// // // //       console.error("📛 Errores de validación:", errors)
// // // //       return errorResponse(res, "Errores de validación", 400, { errors })
// // // //     }

// // // //     return handleError(res, error)
// // // //   }
// // // // }

// // // // // Actualizar escala
// // // // export const updateScale = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params
// // // //     const updateData = { ...req.body }

// // // //     console.log("📝 Actualizando escala:", id, JSON.stringify(updateData, null, 2))

// // // //     // Validar que las fechas sean válidas si se proporcionan
// // // //     if (updateData.fechaInicial) {
// // // //       updateData.fechaInicial = new Date(updateData.fechaInicial)
// // // //     }
// // // //     if (updateData.fechaFinal) {
// // // //       updateData.fechaFinal = new Date(updateData.fechaFinal)
// // // //     }

// // // //     // Validar que apruebaPorcentaje sea un número
// // // //     if (updateData.apruebaPorcentaje) {
// // // //       updateData.apruebaPorcentaje = Number(updateData.apruebaPorcentaje)
// // // //     }

// // // //     // Limpiar métricas
// // // //     if (updateData.metricas && Array.isArray(updateData.metricas)) {
// // // //       updateData.metricas = updateData.metricas
// // // //         .map((metrica) => ({
// // // //           rangoInicial: Number(metrica.rangoInicial),
// // // //           rangoFinal: Number(metrica.rangoFinal),
// // // //           concepto: metrica.concepto,
// // // //           descripcion: metrica.descripcion || "",
// // // //         }))
// // // //         .filter(
// // // //           (metrica) =>
// // // //             metrica.concepto &&
// // // //             typeof metrica.rangoInicial === "number" &&
// // // //             typeof metrica.rangoFinal === "number" &&
// // // //             !isNaN(metrica.rangoInicial) &&
// // // //             !isNaN(metrica.rangoFinal),
// // // //         )
// // // //     }

// // // //     const updatedScale = await Scale.findByIdAndUpdate(id, updateData, {
// // // //       new: true,
// // // //       runValidators: true,
// // // //       context: "query",
// // // //     })

// // // //     if (!updatedScale) {
// // // //       return errorResponse(res, "Escala no encontrada", 404)
// // // //     }

// // // //     console.log("✅ Escala actualizada exitosamente")
// // // //     return successResponse(res, updatedScale, "Escala actualizada exitosamente")
// // // //   } catch (error) {
// // // //     console.error("❌ Error al actualizar escala:", error)

// // // //     if (error.name === "ValidationError") {
// // // //       const errors = Object.values(error.errors).map((err) => err.message)
// // // //       return errorResponse(res, "Errores de validación", 400, { errors })
// // // //     }

// // // //     return handleError(res, error)
// // // //   }
// // // // }

// // // // // Eliminar escala (soft delete)
// // // // export const deleteScale = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params

// // // //     const deletedScale = await Scale.findByIdAndUpdate(id, { estado: "inactivo" }, { new: true })

// // // //     if (!deletedScale) {
// // // //       return errorResponse(res, "Escala no encontrada", 404)
// // // //     }

// // // //     return successResponse(res, deletedScale, "Escala eliminada exitosamente")
// // // //   } catch (error) {
// // // //     console.error("Error al eliminar escala:", error)
// // // //     return handleError(res, error)
// // // //   }
// // // // }

// // // // // Obtener escala vigente para una fecha específica
// // // // export const getActiveScaleByDate = async (req, res) => {
// // // //   try {
// // // //     const { date } = req.query
// // // //     const searchDate = date ? new Date(date) : new Date()

// // // //     const scale = await Scale.findByDate(searchDate)

// // // //     if (!scale) {
// // // //       return errorResponse(res, "No hay escala vigente para la fecha especificada", 404)
// // // //     }

// // // //     return successResponse(res, scale, "Escala vigente obtenida exitosamente")
// // // //   } catch (error) {
// // // //     console.error("Error al obtener escala vigente:", error)
// // // //     return handleError(res, error)
// // // //   }
// // // // }

// // // // // Evaluar una calificación con la escala vigente
// // // // export const evaluateScore = async (req, res) => {
// // // //   try {
// // // //     const { score, date } = req.body

// // // //     if (score === undefined || score === null) {
// // // //       return errorResponse(res, "La calificación es requerida", 400)
// // // //     }

// // // //     const searchDate = date ? new Date(date) : new Date()
// // // //     const scale = await Scale.findByDate(searchDate)

// // // //     if (!scale) {
// // // //       return errorResponse(res, "No hay escala vigente para evaluar la calificación", 404)
// // // //     }

// // // //     const evaluation = scale.evaluateScore(score)

// // // //     return successResponse(
// // // //       res,
// // // //       {
// // // //         calificacion: score,
// // // //         fecha: searchDate,
// // // //         escala: {
// // // //           id: scale._id,
// // // //           porcentajeAprobacion: scale.apruebaPorcentaje,
// // // //           totalMetricas: scale.metricas.length,
// // // //         },
// // // //         resultado: evaluation,
// // // //       },
// // // //       "Calificación evaluada exitosamente",
// // // //     )
// // // //   } catch (error) {
// // // //     console.error("Error al evaluar calificación:", error)
// // // //     return handleError(res, error)
// // // //   }
// // // // }

// // // // // Obtener estadísticas generales
// // // // export const getScaleStats = async (req, res) => {
// // // //   try {
// // // //     const stats = await Scale.aggregate([
// // // //       {
// // // //         $group: {
// // // //           _id: null,
// // // //           totalEscalas: { $sum: 1 },
// // // //           escalasActivas: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
// // // //           escalasInactivas: { $sum: { $cond: [{ $eq: ["$estado", "inactivo"] }, 1, 0] } },
// // // //           promedioAprobacion: { $avg: "$apruebaPorcentaje" },
// // // //           totalMetricas: { $sum: { $size: "$metricas" } },
// // // //         },
// // // //       },
// // // //     ])

// // // //     const currentScale = await Scale.findByDate(new Date())

// // // //     const response = {
// // // //       estadisticas: stats[0] || {
// // // //         totalEscalas: 0,
// // // //         escalasActivas: 0,
// // // //         escalasInactivas: 0,
// // // //         promedioAprobacion: 0,
// // // //         totalMetricas: 0,
// // // //       },
// // // //       escalaVigente: currentScale
// // // //         ? {
// // // //             id: currentScale._id,
// // // //             porcentajeAprobacion: currentScale.apruebaPorcentaje,
// // // //             totalMetricas: currentScale.metricas.length,
// // // //             vigencia: `${currentScale.fechaInicial.toISOString().split("T")[0]} - ${currentScale.fechaFinal.toISOString().split("T")[0]}`,
// // // //           }
// // // //         : null,
// // // //     }

// // // //     return successResponse(res, response, "Estadísticas obtenidas exitosamente")
// // // //   } catch (error) {
// // // //     console.error("Error al obtener estadísticas:", error)
// // // //     return handleError(res, error)
// // // //   }
// // // // }
// // // import Scale from "../models/Scale.js"
// // // import { handleError } from "../utils/errorHandler.js"
// // // import { successResponse, errorResponse } from "../utils/responseHandler.js"

// // // // Obtener todas las escalas con paginación y filtros
// // // export const getScales = async (req, res) => {
// // //   try {
// // //     const { page = 1, limit = 10, estado, valoracion, fechaInicial, fechaFinal, search } = req.query

// // //     // Construir filtros
// // //     const filters = {}

// // //     if (estado) filters.estado = estado
// // //     if (valoracion) filters.valoracion = valoracion

// // //     // Filtro por rango de fechas
// // //     if (fechaInicial || fechaFinal) {
// // //       filters.$and = []
// // //       if (fechaInicial) {
// // //         filters.$and.push({ fechaInicial: { $gte: new Date(fechaInicial) } })
// // //       }
// // //       if (fechaFinal) {
// // //         filters.$and.push({ fechaFinal: { $lte: new Date(fechaFinal) } })
// // //       }
// // //     }

// // //     // Búsqueda por texto en descripción
// // //     if (search) {
// // //       filters.$or = [
// // //         { descripcion: { $regex: search, $options: "i" } },
// // //         { valoracion: { $regex: search, $options: "i" } },
// // //       ]
// // //     }

// // //     // Paginación
// // //     const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

// // //     // Ejecutar consultas
// // //     const [scales, total] = await Promise.all([
// // //       Scale.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit)).lean(),
// // //       Scale.countDocuments(filters),
// // //     ])

// // //     const response = {
// // //       scales,
// // //       pagination: {
// // //         currentPage: Number.parseInt(page),
// // //         totalPages: Math.ceil(total / Number.parseInt(limit)),
// // //         totalItems: total,
// // //         itemsPerPage: Number.parseInt(limit),
// // //         hasNextPage: Number.parseInt(page) < Math.ceil(total / Number.parseInt(limit)),
// // //         hasPrevPage: Number.parseInt(page) > 1,
// // //       },
// // //     }

// // //     return successResponse(res, response, "Escalas obtenidas exitosamente")
// // //   } catch (error) {
// // //     console.error("Error al obtener escalas:", error)
// // //     return handleError(res, error)
// // //   }
// // // }

// // // // Obtener escala por ID
// // // export const getScaleById = async (req, res) => {
// // //   try {
// // //     const { id } = req.params

// // //     const scale = await Scale.findById(id)

// // //     if (!scale) {
// // //       return errorResponse(res, "Escala no encontrada", 404)
// // //     }

// // //     return successResponse(res, scale, "Escala obtenida exitosamente")
// // //   } catch (error) {
// // //     console.error("Error al obtener escala:", error)
// // //     return handleError(res, error)
// // //   }
// // // }

// // // // Crear nueva escala
// // // export const createScale = async (req, res) => {
// // //   try {
// // //     console.log("📝 Datos recibidos para crear escala:", JSON.stringify(req.body, null, 2))

// // //     const scaleData = { ...req.body }

// // //     // Validar que las fechas sean válidas
// // //     if (scaleData.fechaInicial) {
// // //       scaleData.fechaInicial = new Date(scaleData.fechaInicial)
// // //     }
// // //     if (scaleData.fechaFinal) {
// // //       scaleData.fechaFinal = new Date(scaleData.fechaFinal)
// // //     }

// // //     // Validar que apruebaPorcentaje sea un número
// // //     if (scaleData.apruebaPorcentaje) {
// // //       scaleData.apruebaPorcentaje = Number(scaleData.apruebaPorcentaje)
// // //     }

// // //     // Limpiar métricas - remover campos innecesarios como 'id'
// // //     if (scaleData.metricas && Array.isArray(scaleData.metricas)) {
// // //       scaleData.metricas = scaleData.metricas
// // //         .map((metrica) => ({
// // //           rangoInicial: Number(metrica.rangoInicial),
// // //           rangoFinal: Number(metrica.rangoFinal),
// // //           concepto: metrica.concepto,
// // //           descripcion: metrica.descripcion || "",
// // //         }))
// // //         .filter(
// // //           (metrica) =>
// // //             metrica.concepto &&
// // //             typeof metrica.rangoInicial === "number" &&
// // //             typeof metrica.rangoFinal === "number" &&
// // //             !isNaN(metrica.rangoInicial) &&
// // //             !isNaN(metrica.rangoFinal),
// // //         )
// // //     }

// // //     console.log("📤 Datos procesados para crear escala:", JSON.stringify(scaleData, null, 2))

// // //     const newScale = new Scale(scaleData)
// // //     const savedScale = await newScale.save()

// // //     console.log("✅ Escala creada exitosamente:", savedScale._id)
// // //     return successResponse(res, savedScale, "Escala creada exitosamente", 201)
// // //   } catch (error) {
// // //     console.error("❌ Error al crear escala:", error)

// // //     // Manejar diferentes tipos de errores
// // //     if (error.name === "ValidationError") {
// // //       // Verificar si error.errors existe y tiene propiedades
// // //       let errors = []
// // //       if (error.errors && typeof error.errors === "object") {
// // //         errors = Object.values(error.errors).map((err) => err.message)
// // //       } else if (error.message) {
// // //         errors = [error.message]
// // //       }

// // //       console.error("📛 Errores de validación:", errors)
// // //       return errorResponse(res, "Errores de validación", 400, { errors })
// // //     }

// // //     // Error personalizado del middleware pre-save
// // //     if (error.message && error.message.includes("Ya existe una escala activa")) {
// // //       return errorResponse(res, error.message, 400)
// // //     }

// // //     return handleError(res, error)
// // //   }
// // // }

// // // // Actualizar escala
// // // export const updateScale = async (req, res) => {
// // //   try {
// // //     const { id } = req.params
// // //     const updateData = { ...req.body }

// // //     console.log("📝 Actualizando escala:", id, JSON.stringify(updateData, null, 2))

// // //     // Validar que las fechas sean válidas si se proporcionan
// // //     if (updateData.fechaInicial) {
// // //       updateData.fechaInicial = new Date(updateData.fechaInicial)
// // //     }
// // //     if (updateData.fechaFinal) {
// // //       updateData.fechaFinal = new Date(updateData.fechaFinal)
// // //     }

// // //     // Validar que apruebaPorcentaje sea un número
// // //     if (updateData.apruebaPorcentaje) {
// // //       updateData.apruebaPorcentaje = Number(updateData.apruebaPorcentaje)
// // //     }

// // //     // Limpiar métricas
// // //     if (updateData.metricas && Array.isArray(updateData.metricas)) {
// // //       updateData.metricas = updateData.metricas
// // //         .map((metrica) => ({
// // //           rangoInicial: Number(metrica.rangoInicial),
// // //           rangoFinal: Number(metrica.rangoFinal),
// // //           concepto: metrica.concepto,
// // //           descripcion: metrica.descripcion || "",
// // //         }))
// // //         .filter(
// // //           (metrica) =>
// // //             metrica.concepto &&
// // //             typeof metrica.rangoInicial === "number" &&
// // //             typeof metrica.rangoFinal === "number" &&
// // //             !isNaN(metrica.rangoInicial) &&
// // //             !isNaN(metrica.rangoFinal),
// // //         )
// // //     }

// // //     const updatedScale = await Scale.findByIdAndUpdate(id, updateData, {
// // //       new: true,
// // //       runValidators: true,
// // //       context: "query",
// // //     })

// // //     if (!updatedScale) {
// // //       return errorResponse(res, "Escala no encontrada", 404)
// // //     }

// // //     console.log("✅ Escala actualizada exitosamente")
// // //     return successResponse(res, updatedScale, "Escala actualizada exitosamente")
// // //   } catch (error) {
// // //     console.error("❌ Error al actualizar escala:", error)

// // //     if (error.name === "ValidationError") {
// // //       let errors = []
// // //       if (error.errors && typeof error.errors === "object") {
// // //         errors = Object.values(error.errors).map((err) => err.message)
// // //       } else if (error.message) {
// // //         errors = [error.message]
// // //       }
// // //       return errorResponse(res, "Errores de validación", 400, { errors })
// // //     }

// // //     // Error personalizado del middleware pre-save
// // //     if (error.message && error.message.includes("Ya existe una escala activa")) {
// // //       return errorResponse(res, error.message, 400)
// // //     }

// // //     return handleError(res, error)
// // //   }
// // // }

// // // // Eliminar escala (soft delete)
// // // export const deleteScale = async (req, res) => {
// // //   try {
// // //     const { id } = req.params

// // //     const deletedScale = await Scale.findByIdAndUpdate(id, { estado: "inactivo" }, { new: true })

// // //     if (!deletedScale) {
// // //       return errorResponse(res, "Escala no encontrada", 404)
// // //     }

// // //     return successResponse(res, deletedScale, "Escala eliminada exitosamente")
// // //   } catch (error) {
// // //     console.error("Error al eliminar escala:", error)
// // //     return handleError(res, error)
// // //   }
// // // }

// // // // Obtener escala vigente para una fecha específica
// // // export const getActiveScaleByDate = async (req, res) => {
// // //   try {
// // //     const { date } = req.query
// // //     const searchDate = date ? new Date(date) : new Date()

// // //     const scale = await Scale.findByDate(searchDate)

// // //     if (!scale) {
// // //       return errorResponse(res, "No hay escala vigente para la fecha especificada", 404)
// // //     }

// // //     return successResponse(res, scale, "Escala vigente obtenida exitosamente")
// // //   } catch (error) {
// // //     console.error("Error al obtener escala vigente:", error)
// // //     return handleError(res, error)
// // //   }
// // // }

// // // // Evaluar una calificación con la escala vigente
// // // export const evaluateScore = async (req, res) => {
// // //   try {
// // //     const { score, date } = req.body

// // //     if (score === undefined || score === null) {
// // //       return errorResponse(res, "La calificación es requerida", 400)
// // //     }

// // //     const searchDate = date ? new Date(date) : new Date()
// // //     const scale = await Scale.findByDate(searchDate)

// // //     if (!scale) {
// // //       return errorResponse(res, "No hay escala vigente para evaluar la calificación", 404)
// // //     }

// // //     const evaluation = scale.evaluateScore(score)

// // //     return successResponse(
// // //       res,
// // //       {
// // //         calificacion: score,
// // //         fecha: searchDate,
// // //         escala: {
// // //           id: scale._id,
// // //           porcentajeAprobacion: scale.apruebaPorcentaje,
// // //           totalMetricas: scale.metricas.length,
// // //         },
// // //         resultado: evaluation,
// // //       },
// // //       "Calificación evaluada exitosamente",
// // //     )
// // //   } catch (error) {
// // //     console.error("Error al evaluar calificación:", error)
// // //     return handleError(res, error)
// // //   }
// // // }

// // // // Obtener estadísticas generales
// // // export const getScaleStats = async (req, res) => {
// // //   try {
// // //     const stats = await Scale.aggregate([
// // //       {
// // //         $group: {
// // //           _id: null,
// // //           totalEscalas: { $sum: 1 },
// // //           escalasActivas: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
// // //           escalasInactivas: { $sum: { $cond: [{ $eq: ["$estado", "inactivo"] }, 1, 0] } },
// // //           promedioAprobacion: { $avg: "$apruebaPorcentaje" },
// // //           totalMetricas: { $sum: { $size: "$metricas" } },
// // //         },
// // //       },
// // //     ])

// // //     const currentScale = await Scale.findByDate(new Date())

// // //     const response = {
// // //       estadisticas: stats[0] || {
// // //         totalEscalas: 0,
// // //         escalasActivas: 0,
// // //         escalasInactivas: 0,
// // //         promedioAprobacion: 0,
// // //         totalMetricas: 0,
// // //       },
// // //       escalaVigente: currentScale
// // //         ? {
// // //             id: currentScale._id,
// // //             porcentajeAprobacion: currentScale.apruebaPorcentaje,
// // //             totalMetricas: currentScale.metricas.length,
// // //             vigencia: `${currentScale.fechaInicial.toISOString().split("T")[0]} - ${currentScale.fechaFinal.toISOString().split("T")[0]}`,
// // //           }
// // //         : null,
// // //     }

// // //     return successResponse(res, response, "Estadísticas obtenidas exitosamente")
// // //   } catch (error) {
// // //     console.error("Error al obtener estadísticas:", error)
// // //     return handleError(res, error)
// // //   }
// // // }
// // import Scale from "../models/Scale.js"
// // import { handleError } from "../utils/errorHandler.js"
// // import { successResponse, errorResponse } from "../utils/responseHandler.js"

// // // Obtener todas las escalas con paginación y filtros
// // export const getScales = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10, estado, valoracion, fechaInicial, fechaFinal, search } = req.query

// //     // Construir filtros
// //     const filters = {}

// //     if (estado) filters.estado = estado
// //     if (valoracion) filters.valoracion = valoracion

// //     // Filtro por rango de fechas
// //     if (fechaInicial || fechaFinal) {
// //       filters.$and = []
// //       if (fechaInicial) {
// //         filters.$and.push({ fechaInicial: { $gte: new Date(fechaInicial) } })
// //       }
// //       if (fechaFinal) {
// //         filters.$and.push({ fechaFinal: { $lte: new Date(fechaFinal) } })
// //       }
// //     }

// //     // Búsqueda por texto en descripción
// //     if (search) {
// //       filters.$or = [
// //         { descripcion: { $regex: search, $options: "i" } },
// //         { valoracion: { $regex: search, $options: "i" } },
// //       ]
// //     }

// //     // Paginación
// //     const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

// //     // Ejecutar consultas
// //     const [scales, total] = await Promise.all([
// //       Scale.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit)).lean(),
// //       Scale.countDocuments(filters),
// //     ])

// //     console.log("📊 Escalas encontradas en BD:", scales.length)
// //     console.log("📋 Total en BD:", total)
// //     console.log("🔍 Filtros aplicados:", filters)
// //     console.log(
// //       "📄 Escalas:",
// //       scales.map((s) => ({
// //         id: s._id,
// //         fechas: `${s.fechaInicial} - ${s.fechaFinal}`,
// //         estado: s.estado,
// //       })),
// //     )

// //     const response = {
// //       scales,
// //       pagination: {
// //         currentPage: Number.parseInt(page),
// //         totalPages: Math.ceil(total / Number.parseInt(limit)),
// //         totalItems: total,
// //         itemsPerPage: Number.parseInt(limit),
// //         hasNextPage: Number.parseInt(page) < Math.ceil(total / Number.parseInt(limit)),
// //         hasPrevPage: Number.parseInt(page) > 1,
// //       },
// //     }
// //     const pagination = {
// //   currentPage: Number.parseInt(page),
// //   totalPages: Math.ceil(total / Number.parseInt(limit)),
// //   totalItems: total,
// //   itemsPerPage: Number.parseInt(limit),
// //   hasNextPage: Number.parseInt(page) < Math.ceil(total / Number.parseInt(limit)),
// //   hasPrevPage: Number.parseInt(page) > 1,
// // };

// //     return res.status(200).json({
// //       success: true,
// //       data: {
// //         scales,
// //         pagination,
// //       },
// //       message: "Escalas obtenidas exitosamente",
// //     });

// //   } catch (error) {
// //     console.error("Error al obtener escalas:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Error al obtener escalas",
// //       error: error.message,
// //     });
// // }
// // }
// // // Obtener escala por ID
// // export const getScaleById = async (req, res) => {
// //   try {
// //     const { id } = req.params

// //     const scale = await Scale.findById(id)

// //     if (!scale) {
// //       return errorResponse(res, "Escala no encontrada", 404)
// //     }

// //     return successResponse(res, scale, "Escala obtenida exitosamente")
// //   } catch (error) {
// //     console.error("Error al obtener escala:", error)
// //     return handleError(res, error)
// //   }
// // }

// // // Crear nueva escala
// // export const createScale = async (req, res) => {
// //   try {
// //     console.log("📝 Datos recibidos para crear escala:", JSON.stringify(req.body, null, 2))

// //     const scaleData = { ...req.body }

// //     // Validar que las fechas sean válidas
// //     if (scaleData.fechaInicial) {
// //       scaleData.fechaInicial = new Date(scaleData.fechaInicial)
// //     }
// //     if (scaleData.fechaFinal) {
// //       scaleData.fechaFinal = new Date(scaleData.fechaFinal)
// //     }

// //     // Validar que apruebaPorcentaje sea un número
// //     if (scaleData.apruebaPorcentaje) {
// //       scaleData.apruebaPorcentaje = Number(scaleData.apruebaPorcentaje)
// //     }

// //     // Limpiar métricas - remover campos innecesarios como 'id'
// //     if (scaleData.metricas && Array.isArray(scaleData.metricas)) {
// //       scaleData.metricas = scaleData.metricas
// //         .map((metrica) => ({
// //           rangoInicial: Number(metrica.rangoInicial),
// //           rangoFinal: Number(metrica.rangoFinal),
// //           concepto: metrica.concepto,
// //           descripcion: metrica.descripcion || "",
// //         }))
// //         .filter(
// //           (metrica) =>
// //             metrica.concepto &&
// //             typeof metrica.rangoInicial === "number" &&
// //             typeof metrica.rangoFinal === "number" &&
// //             !isNaN(metrica.rangoInicial) &&
// //             !isNaN(metrica.rangoFinal),
// //         )
// //     }

// //     console.log("📤 Datos procesados para crear escala:", JSON.stringify(scaleData, null, 2))

// //     const newScale = new Scale(scaleData)
// //     const savedScale = await newScale.save()

// //     console.log("✅ Escala creada exitosamente:", savedScale._id)
// //     return successResponse(res, savedScale, "Escala creada exitosamente", 201)
// //   } catch (error) {
// //     console.error("❌ Error al crear escala:", error)

// //     // Manejar diferentes tipos de errores
// //     if (error.name === "ValidationError") {
// //       // Verificar si error.errors existe y tiene propiedades
// //       let errors = []
// //       if (error.errors && typeof error.errors === "object") {
// //         errors = Object.values(error.errors).map((err) => err.message)
// //       } else if (error.message) {
// //         errors = [error.message]
// //       }

// //       console.error("📛 Errores de validación:", errors)
// //       return errorResponse(res, "Errores de validación", 400, { errors })
// //     }

// //     // Error personalizado del middleware pre-save
// //     if (error.message && error.message.includes("Ya existe una escala activa")) {
// //       return errorResponse(res, error.message, 400)
// //     }

// //     return handleError(res, error)
// //   }
// // }

// // // Actualizar escala
// // export const updateScale = async (req, res) => {
// //   try {
// //     const { id } = req.params
// //     const updateData = { ...req.body }

// //     console.log("📝 Actualizando escala:", id, JSON.stringify(updateData, null, 2))

// //     // Validar que las fechas sean válidas si se proporcionan
// //     if (updateData.fechaInicial) {
// //       updateData.fechaInicial = new Date(updateData.fechaInicial)
// //     }
// //     if (updateData.fechaFinal) {
// //       updateData.fechaFinal = new Date(updateData.fechaFinal)
// //     }

// //     // Validar que apruebaPorcentaje sea un número
// //     if (updateData.apruebaPorcentaje) {
// //       updateData.apruebaPorcentaje = Number(updateData.apruebaPorcentaje)
// //     }

// //     // Limpiar métricas
// //     if (updateData.metricas && Array.isArray(updateData.metricas)) {
// //       updateData.metricas = updateData.metricas
// //         .map((metrica) => ({
// //           rangoInicial: Number(metrica.rangoInicial),
// //           rangoFinal: Number(metrica.rangoFinal),
// //           concepto: metrica.concepto,
// //           descripcion: metrica.descripcion || "",
// //         }))
// //         .filter(
// //           (metrica) =>
// //             metrica.concepto &&
// //             typeof metrica.rangoInicial === "number" &&
// //             typeof metrica.rangoFinal === "number" &&
// //             !isNaN(metrica.rangoInicial) &&
// //             !isNaN(metrica.rangoFinal),
// //         )
// //     }

// //     const updatedScale = await Scale.findByIdAndUpdate(id, updateData, {
// //       new: true,
// //       runValidators: true,
// //       context: "query",
// //     })

// //     if (!updatedScale) {
// //       return errorResponse(res, "Escala no encontrada", 404)
// //     }

// //     console.log("✅ Escala actualizada exitosamente")
// //     return successResponse(res, updatedScale, "Escala actualizada exitosamente")
// //   } catch (error) {
// //     console.error("❌ Error al actualizar escala:", error)

// //     if (error.name === "ValidationError") {
// //       let errors = []
// //       if (error.errors && typeof error.errors === "object") {
// //         errors = Object.values(error.errors).map((err) => err.message)
// //       } else if (error.message) {
// //         errors = [error.message]
// //       }
// //       return errorResponse(res, "Errores de validación", 400, { errors })
// //     }

// //     // Error personalizado del middleware pre-save
// //     if (error.message && error.message.includes("Ya existe una escala activa")) {
// //       return errorResponse(res, error.message, 400)
// //     }

// //     return handleError(res, error)
// //   }
// // }

// // // Eliminar escala (soft delete)
// // export const deleteScale = async (req, res) => {
// //   try {
// //     const { id } = req.params

// //     const deletedScale = await Scale.findByIdAndUpdate(id, { estado: "inactivo" }, { new: true })

// //     if (!deletedScale) {
// //       return errorResponse(res, "Escala no encontrada", 404)
// //     }

// //     return successResponse(res, deletedScale, "Escala eliminada exitosamente")
// //   } catch (error) {
// //     console.error("Error al eliminar escala:", error)
// //     return handleError(res, error)
// //   }
// // }

// // // Obtener escala vigente para una fecha específica
// // export const getActiveScaleByDate = async (req, res) => {
// //   try {
// //     const { date } = req.query
// //     const searchDate = date ? new Date(date) : new Date()

// //     const scale = await Scale.findByDate(searchDate)

// //     if (!scale) {
// //       return errorResponse(res, "No hay escala vigente para la fecha especificada", 404)
// //     }

// //     return successResponse(res, scale, "Escala vigente obtenida exitosamente")
// //   } catch (error) {
// //     console.error("Error al obtener escala vigente:", error)
// //     return handleError(res, error)
// //   }
// // }

// // // Evaluar una calificación con la escala vigente
// // export const evaluateScore = async (req, res) => {
// //   try {
// //     const { score, date } = req.body

// //     if (score === undefined || score === null) {
// //       return errorResponse(res, "La calificación es requerida", 400)
// //     }

// //     const searchDate = date ? new Date(date) : new Date()
// //     const scale = await Scale.findByDate(searchDate)

// //     if (!scale) {
// //       return errorResponse(res, "No hay escala vigente para evaluar la calificación", 404)
// //     }

// //     const evaluation = scale.evaluateScore(score)

// //     return successResponse(
// //       res,
// //       {
// //         calificacion: score,
// //         fecha: searchDate,
// //         escala: {
// //           id: scale._id,
// //           porcentajeAprobacion: scale.apruebaPorcentaje,
// //           totalMetricas: scale.metricas.length,
// //         },
// //         resultado: evaluation,
// //       },
// //       "Calificación evaluada exitosamente",
// //     )
// //   } catch (error) {
// //     console.error("Error al evaluar calificación:", error)
// //     return handleError(res, error)
// //   }
// // }

// // // Obtener estadísticas generales
// // export const getScaleStats = async (req, res) => {
// //   try {
// //     const stats = await Scale.aggregate([
// //       {
// //         $group: {
// //           _id: null,
// //           totalEscalas: { $sum: 1 },
// //           escalasActivas: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
// //           escalasInactivas: { $sum: { $cond: [{ $eq: ["$estado", "inactivo"] }, 1, 0] } },
// //           promedioAprobacion: { $avg: "$apruebaPorcentaje" },
// //           totalMetricas: { $sum: { $size: "$metricas" } },
// //         },
// //       },
// //     ])

// //     const currentScale = await Scale.findByDate(new Date())

// //     const response = {
// //       estadisticas: stats[0] || {
// //         totalEscalas: 0,
// //         escalasActivas: 0,
// //         escalasInactivas: 0,
// //         promedioAprobacion: 0,
// //         totalMetricas: 0,
// //       },
// //       escalaVigente: currentScale
// //         ? {
// //             id: currentScale._id,
// //             porcentajeAprobacion: currentScale.apruebaPorcentaje,
// //             totalMetricas: currentScale.metricas.length,
// //             vigencia: `${currentScale.fechaInicial.toISOString().split("T")[0]} - ${currentScale.fechaFinal.toISOString().split("T")[0]}`,
// //           }
// //         : null,
// //     }

// //     return successResponse(res, response, "Estadísticas obtenidas exitosamente")
// //   } catch (error) {
// //     console.error("Error al obtener estadísticas:", error)
// //     return handleError(res, error)
// //   }
// // }
// import Scale from "../models/Scale.js"
// import { handleError } from "../utils/errorHandler.js"
// import { successResponse, errorResponse } from "../utils/responseHandler.js"

// // Obtener todas las escalas con paginación y filtros - MANTENER EXACTAMENTE COMO ESTÁ
// export const getScales = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, estado, valoracion, fechaInicial, fechaFinal, search } = req.query

//     // Construir filtros
//     const filters = {}

//     if (estado) filters.estado = estado
//     if (valoracion) filters.valoracion = valoracion

//     // Filtro por rango de fechas
//     if (fechaInicial || fechaFinal) {
//       filters.$and = []
//       if (fechaInicial) {
//         filters.$and.push({ fechaInicial: { $gte: new Date(fechaInicial) } })
//       }
//       if (fechaFinal) {
//         filters.$and.push({ fechaFinal: { $lte: new Date(fechaFinal) } })
//       }
//     }

//     // Búsqueda por texto en descripción
//     if (search) {
//       filters.$or = [
//         { descripcion: { $regex: search, $options: "i" } },
//         { valoracion: { $regex: search, $options: "i" } },
//       ]
//     }

//     // Paginación
//     const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

//     // Ejecutar consultas
//     const [scales, total] = await Promise.all([
//       Scale.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit)).lean(),
//       Scale.countDocuments(filters),
//     ])

//     console.log("📊 Escalas encontradas en BD:", scales.length)
//     console.log("📋 Total en BD:", total)
//     console.log("🔍 Filtros aplicados:", filters)
//     console.log(
//       "📄 Escalas:",
//       scales.map((s) => ({
//         id: s._id,
//         fechas: `${s.fechaInicial} - ${s.fechaFinal}`,
//         estado: s.estado,
//       })),
//     )

//     const pagination = {
//       currentPage: Number.parseInt(page),
//       totalPages: Math.ceil(total / Number.parseInt(limit)),
//       totalItems: total,
//       itemsPerPage: Number.parseInt(limit),
//       hasNextPage: Number.parseInt(page) < Math.ceil(total / Number.parseInt(limit)),
//       hasPrevPage: Number.parseInt(page) > 1,
//     }

//     return res.status(200).json({
//       success: true,
//       data: {
//         scales,
//         pagination,
//       },
//       message: "Escalas obtenidas exitosamente",
//     })
//   } catch (error) {
//     console.error("Error al obtener escalas:", error)
//     return res.status(500).json({
//       success: false,
//       message: "Error al obtener escalas",
//       error: error.message,
//     })
//   }
// }

// // Obtener escala por ID
// export const getScaleById = async (req, res) => {
//   try {
//     const { id } = req.params

//     const scale = await Scale.findById(id)

//     if (!scale) {
//       return errorResponse(res, "Escala no encontrada", 404)
//     }

//     return successResponse(res, scale, "Escala obtenida exitosamente")
//   } catch (error) {
//     console.error("Error al obtener escala:", error)
//     return handleError(res, error)
//   }
// }

// // Crear nueva escala
// export const createScale = async (req, res) => {
//   try {
//     console.log("📝 Datos recibidos para crear escala:", JSON.stringify(req.body, null, 2))

//     const scaleData = { ...req.body }

//     // Validar que las fechas sean válidas
//     if (scaleData.fechaInicial) {
//       scaleData.fechaInicial = new Date(scaleData.fechaInicial)
//     }
//     if (scaleData.fechaFinal) {
//       scaleData.fechaFinal = new Date(scaleData.fechaFinal)
//     }

//     // Validar que apruebaPorcentaje sea un número
//     if (scaleData.apruebaPorcentaje) {
//       scaleData.apruebaPorcentaje = Number(scaleData.apruebaPorcentaje)
//     }

//     // Limpiar métricas - remover campos innecesarios como 'id'
//     if (scaleData.metricas && Array.isArray(scaleData.metricas)) {
//       scaleData.metricas = scaleData.metricas
//         .map((metrica) => ({
//           rangoInicial: Number(metrica.rangoInicial),
//           rangoFinal: Number(metrica.rangoFinal),
//           concepto: metrica.concepto,
//           descripcion: metrica.descripcion || "",
//         }))
//         .filter(
//           (metrica) =>
//             metrica.concepto &&
//             typeof metrica.rangoInicial === "number" &&
//             typeof metrica.rangoFinal === "number" &&
//             !isNaN(metrica.rangoInicial) &&
//             !isNaN(metrica.rangoFinal),
//         )
//     }

//     console.log("📤 Datos procesados para crear escala:", JSON.stringify(scaleData, null, 2))

//     const newScale = new Scale(scaleData)
//     const savedScale = await newScale.save()

//     console.log("✅ Escala creada exitosamente:", savedScale._id)
//     return successResponse(res, savedScale, "Escala creada exitosamente", 201)
//   } catch (error) {
//     console.error("❌ Error al crear escala:", error)

//     // Manejar diferentes tipos de errores
//     if (error.name === "ValidationError") {
//       // Verificar si error.errors existe y tiene propiedades
//       let errors = []
//       if (error.errors && typeof error.errors === "object") {
//         errors = Object.values(error.errors).map((err) => err.message)
//       } else if (error.message) {
//         errors = [error.message]
//       }

//       console.error("📛 Errores de validación:", errors)
//       return errorResponse(res, "Errores de validación", 400, { errors })
//     }

//     // Error personalizado del middleware pre-save
//     if (error.message && error.message.includes("Ya existe una escala activa")) {
//       return errorResponse(res, error.message, 400)
//     }

//     return handleError(res, error)
//   }
// }

// // Actualizar escala - ARREGLADO PARA EVITAR ERRORES DE VALIDACIÓN
// export const updateScale = async (req, res) => {
//   try {
//     const { id } = req.params
//     const updateData = { ...req.body }

//     console.log("🔧 ===== ACTUALIZANDO ESCALA =====")
//     console.log("🆔 ID:", id)
//     console.log("📋 Datos recibidos:", JSON.stringify(updateData, null, 2))

//     // Verificar que la escala existe
//     const existingScale = await Scale.findById(id)
//     if (!existingScale) {
//       console.error("❌ Escala no encontrada:", id)
//       return errorResponse(res, "Escala no encontrada", 404)
//     }

//     console.log("📋 Escala existente encontrada:", existingScale._id)

//     // Validar y procesar fechas
//     if (updateData.fechaInicial) {
//       const fechaInicial = new Date(updateData.fechaInicial)
//       if (isNaN(fechaInicial.getTime())) {
//         return errorResponse(res, "Fecha inicial inválida", 400)
//       }
//       updateData.fechaInicial = fechaInicial
//       console.log("✅ Fecha inicial procesada:", fechaInicial)
//     }

//     if (updateData.fechaFinal) {
//       const fechaFinal = new Date(updateData.fechaFinal)
//       if (isNaN(fechaFinal.getTime())) {
//         return errorResponse(res, "Fecha final inválida", 400)
//       }
//       updateData.fechaFinal = fechaFinal
//       console.log("✅ Fecha final procesada:", fechaFinal)
//     }

//     // Validar porcentaje de aprobación
//     if (updateData.apruebaPorcentaje !== undefined) {
//       const porcentaje = Number(updateData.apruebaPorcentaje)
//       if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
//         return errorResponse(res, "Porcentaje de aprobación debe estar entre 0 y 100", 400)
//       }
//       updateData.apruebaPorcentaje = porcentaje
//       console.log("✅ Porcentaje procesado:", porcentaje)
//     }

//     // Limpiar métricas
//     if (updateData.metricas !== undefined) {
//       if (!Array.isArray(updateData.metricas)) {
//         return errorResponse(res, "Métricas debe ser un array", 400)
//       }

//       if (updateData.metricas.length === 0) {
//         updateData.metricas = []
//         console.log("✅ Métricas vacías - OK")
//       } else {
//         const metricasLimpias = []
//         for (let i = 0; i < updateData.metricas.length; i++) {
//           const metrica = updateData.metricas[i]

//           // Validar concepto
//           if (!metrica.concepto || metrica.concepto.trim() === "") {
//             return errorResponse(res, `Métrica ${i + 1}: concepto es requerido`, 400)
//           }

//           // Validar rangos
//           const rangoInicial = Number(metrica.rangoInicial)
//           const rangoFinal = Number(metrica.rangoFinal)

//           if (isNaN(rangoInicial) || isNaN(rangoFinal)) {
//             return errorResponse(res, `Métrica ${i + 1}: rangos deben ser números válidos`, 400)
//           }

//           if (rangoInicial < 0 || rangoInicial > 100 || rangoFinal < 0 || rangoFinal > 100) {
//             return errorResponse(res, `Métrica ${i + 1}: rangos deben estar entre 0 y 100`, 400)
//           }

//           if (rangoFinal <= rangoInicial) {
//             return errorResponse(res, `Métrica ${i + 1}: rango final debe ser mayor al inicial`, 400)
//           }

//           metricasLimpias.push({
//             rangoInicial,
//             rangoFinal,
//             concepto: metrica.concepto.trim(),
//             descripcion: (metrica.descripcion || "").trim(),
//           })
//         }
//         updateData.metricas = metricasLimpias
//         console.log("✅ Métricas procesadas:", metricasLimpias.length)
//       }
//     }

//     console.log("📤 Datos finales para actualizar:", JSON.stringify(updateData, null, 2))

//     // CLAVE: Usar findByIdAndUpdate SIN runValidators para evitar conflictos
//     const updatedScale = await Scale.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: false, // IMPORTANTE: Desactivar validadores automáticos
//     })

//     if (!updatedScale) {
//       console.error("❌ No se pudo actualizar la escala")
//       return errorResponse(res, "No se pudo actualizar la escala", 500)
//     }

//     console.log("✅ Escala actualizada exitosamente:", updatedScale._id)
//     console.log("🔧 ===== FIN ACTUALIZACIÓN =====")

//     return successResponse(res, updatedScale, "Escala actualizada exitosamente")
//   } catch (error) {
//     console.error("❌ ERROR COMPLETO al actualizar escala:", error)
//     console.error("❌ Error name:", error.name)
//     console.error("❌ Error message:", error.message)

//     // Manejar errores específicos
//     if (error.name === "ValidationError") {
//       let errors = []
//       if (error.errors && typeof error.errors === "object") {
//         errors = Object.values(error.errors).map((err) => err.message)
//       } else if (error.message) {
//         errors = [error.message]
//       }
//       console.error("📛 Errores de validación específicos:", errors)
//       return errorResponse(res, "Errores de validación", 400, { errors })
//     }

//     // Error de solapamiento de fechas
//     if (error.message && error.message.includes("Ya existe una escala activa")) {
//       return errorResponse(res, error.message, 400)
//     }

//     // Error genérico
//     return res.status(500).json({
//       success: false,
//       message: "Error interno del servidor al actualizar escala",
//       error: error.message,
//     })
//   }
// }

// // Eliminar escala (soft delete)
// export const deleteScale = async (req, res) => {
//   try {
//     const { id } = req.params

//     const deletedScale = await Scale.findByIdAndUpdate(id, { estado: "inactivo" }, { new: true })

//     if (!deletedScale) {
//       return errorResponse(res, "Escala no encontrada", 404)
//     }

//     return successResponse(res, deletedScale, "Escala eliminada exitosamente")
//   } catch (error) {
//     console.error("Error al eliminar escala:", error)
//     return handleError(res, error)
//   }
// }

// // Obtener escala vigente para una fecha específica
// export const getActiveScaleByDate = async (req, res) => {
//   try {
//     const { date } = req.query
//     const searchDate = date ? new Date(date) : new Date()

//     const scale = await Scale.findByDate(searchDate)

//     if (!scale) {
//       return errorResponse(res, "No hay escala vigente para la fecha especificada", 404)
//     }

//     return successResponse(res, scale, "Escala vigente obtenida exitosamente")
//   } catch (error) {
//     console.error("Error al obtener escala vigente:", error)
//     return handleError(res, error)
//   }
// }

// // Evaluar una calificación con la escala vigente
// export const evaluateScore = async (req, res) => {
//   try {
//     const { score, date } = req.body

//     if (score === undefined || score === null) {
//       return errorResponse(res, "La calificación es requerida", 400)
//     }

//     const searchDate = date ? new Date(date) : new Date()
//     const scale = await Scale.findByDate(searchDate)

//     if (!scale) {
//       return errorResponse(res, "No hay escala vigente para evaluar la calificación", 404)
//     }

//     const evaluation = scale.evaluateScore(score)

//     return successResponse(
//       res,
//       {
//         calificacion: score,
//         fecha: searchDate,
//         escala: {
//           id: scale._id,
//           porcentajeAprobacion: scale.apruebaPorcentaje,
//           totalMetricas: scale.metricas.length,
//         },
//         resultado: evaluation,
//       },
//       "Calificación evaluada exitosamente",
//     )
//   } catch (error) {
//     console.error("Error al evaluar calificación:", error)
//     return handleError(res, error)
//   }
// }

// // Obtener estadísticas generales
// export const getScaleStats = async (req, res) => {
//   try {
//     const stats = await Scale.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalEscalas: { $sum: 1 },
//           escalasActivas: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
//           escalasInactivas: { $sum: { $cond: [{ $eq: ["$estado", "inactivo"] }, 1, 0] } },
//           promedioAprobacion: { $avg: "$apruebaPorcentaje" },
//           totalMetricas: { $sum: { $size: "$metricas" } },
//         },
//       },
//     ])

//     const currentScale = await Scale.findByDate(new Date())

//     const response = {
//       estadisticas: stats[0] || {
//         totalEscalas: 0,
//         escalasActivas: 0,
//         escalasInactivas: 0,
//         promedioAprobacion: 0,
//         totalMetricas: 0,
//       },
//       escalaVigente: currentScale
//         ? {
//             id: currentScale._id,
//             porcentajeAprobacion: currentScale.apruebaPorcentaje,
//             totalMetricas: currentScale.metricas.length,
//             vigencia: `${currentScale.fechaInicial.toISOString().split("T")[0]} - ${currentScale.fechaFinal.toISOString().split("T")[0]}`,
//           }
//         : null,
//     }

//     return successResponse(res, response, "Estadísticas obtenidas exitosamente")
//   } catch (error) {
//     console.error("Error al obtener estadísticas:", error)
//     return handleError(res, error)
//   }
// }
import Scale from "../models/Scale.js"
import { handleError } from "../utils/errorHandler.js"
import { successResponse, errorResponse } from "../utils/responseHandler.js"

// Obtener todas las escalas con paginación y filtros - MANTENER EXACTAMENTE COMO ESTÁ
export const getScales = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado, valoracion, fechaInicial, fechaFinal, search } = req.query

    // Construir filtros
    const filters = {}

    if (estado) filters.estado = estado
    if (valoracion) filters.valoracion = valoracion

    // Filtro por rango de fechas
    if (fechaInicial || fechaFinal) {
      filters.$and = []
      if (fechaInicial) {
        filters.$and.push({ fechaInicial: { $gte: new Date(fechaInicial) } })
      }
      if (fechaFinal) {
        filters.$and.push({ fechaFinal: { $lte: new Date(fechaFinal) } })
      }
    }

    // Búsqueda por texto en descripción
    if (search) {
      filters.$or = [
        { descripcion: { $regex: search, $options: "i" } },
        { valoracion: { $regex: search, $options: "i" } },
      ]
    }

    // Paginación
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Ejecutar consultas
    const [scales, total] = await Promise.all([
      Scale.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit)).lean(),
      Scale.countDocuments(filters),
    ])

    console.log("📊 Escalas encontradas en BD:", scales.length)
    console.log("📋 Total en BD:", total)
    console.log("🔍 Filtros aplicados:", filters)
    console.log(
      "📄 Escalas:",
      scales.map((s) => ({
        id: s._id,
        fechas: `${s.fechaInicial} - ${s.fechaFinal}`,
        estado: s.estado,
      })),
    )

    const pagination = {
      currentPage: Number.parseInt(page),
      totalPages: Math.ceil(total / Number.parseInt(limit)),
      totalItems: total,
      itemsPerPage: Number.parseInt(limit),
      hasNextPage: Number.parseInt(page) < Math.ceil(total / Number.parseInt(limit)),
      hasPrevPage: Number.parseInt(page) > 1,
    }

    return res.status(200).json({
      success: true,
      data: {
        scales,
        pagination,
      },
      message: "Escalas obtenidas exitosamente",
    })
  } catch (error) {
    console.error("Error al obtener escalas:", error)
    return res.status(500).json({
      success: false,
      message: "Error al obtener escalas",
      error: error.message,
    })
  }
}

// Obtener escala por ID
export const getScaleById = async (req, res) => {
  try {
    const { id } = req.params

    const scale = await Scale.findById(id)

    if (!scale) {
      return errorResponse(res, "Escala no encontrada", 404)
    }

    return successResponse(res, scale, "Escala obtenida exitosamente")
  } catch (error) {
    console.error("Error al obtener escala:", error)
    return handleError(res, error)
  }
}

// Crear nueva escala
export const createScale = async (req, res) => {
  try {
    console.log("📝 Datos recibidos para crear escala:", JSON.stringify(req.body, null, 2))

    const scaleData = { ...req.body }

    // Validar que las fechas sean válidas
    if (scaleData.fechaInicial) {
      scaleData.fechaInicial = new Date(scaleData.fechaInicial)
    }
    if (scaleData.fechaFinal) {
      scaleData.fechaFinal = new Date(scaleData.fechaFinal)
    }

    // Validar que apruebaPorcentaje sea un número
    if (scaleData.apruebaPorcentaje) {
      scaleData.apruebaPorcentaje = Number(scaleData.apruebaPorcentaje)
    }

    // Limpiar métricas - remover campos innecesarios como 'id'
    if (scaleData.metricas && Array.isArray(scaleData.metricas)) {
      scaleData.metricas = scaleData.metricas
        .map((metrica) => ({
          rangoInicial: Number(metrica.rangoInicial),
          rangoFinal: Number(metrica.rangoFinal),
          concepto: metrica.concepto,
          descripcion: metrica.descripcion || "",
        }))
        .filter(
          (metrica) =>
            metrica.concepto &&
            typeof metrica.rangoInicial === "number" &&
            typeof metrica.rangoFinal === "number" &&
            !isNaN(metrica.rangoInicial) &&
            !isNaN(metrica.rangoFinal),
        )
    }

    console.log("📤 Datos procesados para crear escala:", JSON.stringify(scaleData, null, 2))

    const newScale = new Scale(scaleData)
    const savedScale = await newScale.save()

    console.log("✅ Escala creada exitosamente:", savedScale._id)
    return successResponse(res, savedScale, "Escala creada exitosamente", 201)
  } catch (error) {
    console.error("❌ Error al crear escala:", error)

    // Manejar diferentes tipos de errores
    if (error.name === "ValidationError") {
      // Verificar si error.errors existe y tiene propiedades
      let errors = []
      if (error.errors && typeof error.errors === "object") {
        errors = Object.values(error.errors).map((err) => err.message)
      } else if (error.message) {
        errors = [error.message]
      }

      console.error("📛 Errores de validación:", errors)
      return errorResponse(res, "Errores de validación", 400, { errors })
    }

    // Error personalizado del middleware pre-save
    if (error.message && error.message.includes("Ya existe una escala activa")) {
      return errorResponse(res, error.message, 400)
    }

    return handleError(res, error)
  }
}

// Actualizar escala - ARREGLADO PARA EVITAR ERRORES DE VALIDACIÓN
export const updateScale = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    console.log("🔧 ===== ACTUALIZANDO ESCALA =====")
    console.log("🆔 ID:", id)
    console.log("📋 Datos recibidos:", JSON.stringify(updateData, null, 2))

    // Verificar que la escala existe
    const existingScale = await Scale.findById(id)
    if (!existingScale) {
      console.error("❌ Escala no encontrada:", id)
      return errorResponse(res, "Escala no encontrada", 404)
    }

    console.log("📋 Escala existente encontrada:", existingScale._id)

    // Validar y procesar fechas
    if (updateData.fechaInicial) {
      const fechaInicial = new Date(updateData.fechaInicial)
      if (isNaN(fechaInicial.getTime())) {
        return errorResponse(res, "Fecha inicial inválida", 400)
      }
      updateData.fechaInicial = fechaInicial
      console.log("✅ Fecha inicial procesada:", fechaInicial)
    }

    if (updateData.fechaFinal) {
      const fechaFinal = new Date(updateData.fechaFinal)
      if (isNaN(fechaFinal.getTime())) {
        return errorResponse(res, "Fecha final inválida", 400)
      }
      updateData.fechaFinal = fechaFinal
      console.log("✅ Fecha final procesada:", fechaFinal)
    }

    // Validar porcentaje de aprobación
    if (updateData.apruebaPorcentaje !== undefined) {
      const porcentaje = Number(updateData.apruebaPorcentaje)
      if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
        return errorResponse(res, "Porcentaje de aprobación debe estar entre 0 y 100", 400)
      }
      updateData.apruebaPorcentaje = porcentaje
      console.log("✅ Porcentaje procesado:", porcentaje)
    }

    // Limpiar métricas
    if (updateData.metricas !== undefined) {
      if (!Array.isArray(updateData.metricas)) {
        return errorResponse(res, "Métricas debe ser un array", 400)
      }

      if (updateData.metricas.length === 0) {
        updateData.metricas = []
        console.log("✅ Métricas vacías - OK")
      } else {
        const metricasLimpias = []
        for (let i = 0; i < updateData.metricas.length; i++) {
          const metrica = updateData.metricas[i]

          // Validar concepto
          if (!metrica.concepto || metrica.concepto.trim() === "") {
            return errorResponse(res, `Métrica ${i + 1}: concepto es requerido`, 400)
          }

          // Validar rangos
          const rangoInicial = Number(metrica.rangoInicial)
          const rangoFinal = Number(metrica.rangoFinal)

          if (isNaN(rangoInicial) || isNaN(rangoFinal)) {
            return errorResponse(res, `Métrica ${i + 1}: rangos deben ser números válidos`, 400)
          }

          if (rangoInicial < 0 || rangoInicial > 100 || rangoFinal < 0 || rangoFinal > 100) {
            return errorResponse(res, `Métrica ${i + 1}: rangos deben estar entre 0 y 100`, 400)
          }

          if (rangoFinal <= rangoInicial) {
            return errorResponse(res, `Métrica ${i + 1}: rango final debe ser mayor al inicial`, 400)
          }

          metricasLimpias.push({
            rangoInicial,
            rangoFinal,
            concepto: metrica.concepto.trim(),
            descripcion: (metrica.descripcion || "").trim(),
          })
        }
        updateData.metricas = metricasLimpias
        console.log("✅ Métricas procesadas:", metricasLimpias.length)
      }
    }

    console.log("📤 Datos finales para actualizar:", JSON.stringify(updateData, null, 2))

    // CLAVE: Usar findByIdAndUpdate SIN runValidators para evitar conflictos
    const updatedScale = await Scale.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false, // IMPORTANTE: Desactivar validadores automáticos
    })

    if (!updatedScale) {
      console.error("❌ No se pudo actualizar la escala")
      return errorResponse(res, "No se pudo actualizar la escala", 500)
    }

    console.log("✅ Escala actualizada exitosamente:", updatedScale._id)
    console.log("🔧 ===== FIN ACTUALIZACIÓN =====")

    return successResponse(res, updatedScale, "Escala actualizada exitosamente")
  } catch (error) {
    console.error("❌ ERROR COMPLETO al actualizar escala:", error)
    console.error("❌ Error name:", error.name)
    console.error("❌ Error message:", error.message)

    // Manejar errores específicos
    if (error.name === "ValidationError") {
      let errors = []
      if (error.errors && typeof error.errors === "object") {
        errors = Object.values(error.errors).map((err) => err.message)
      } else if (error.message) {
        errors = [error.message]
      }
      console.error("📛 Errores de validación específicos:", errors)
      return errorResponse(res, "Errores de validación", 400, { errors })
    }

    // Error de solapamiento de fechas
    if (error.message && error.message.includes("Ya existe una escala activa")) {
      return errorResponse(res, error.message, 400)
    }

    // Error genérico
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al actualizar escala",
      error: error.message,
    })
  }
}

// Eliminar escala (hard delete - eliminación física)
export const deleteScale = async (req, res) => {
  try {
    const { id } = req.params

    console.log("🗑️ ===== ELIMINANDO ESCALA FÍSICAMENTE =====")
    console.log("🆔 ID a eliminar:", id)

    // Verificar que la escala existe antes de eliminar
    const existingScale = await Scale.findById(id)
    if (!existingScale) {
      console.error("❌ Escala no encontrada:", id)
      return errorResponse(res, "Escala no encontrada", 404)
    }

    console.log("📋 Escala encontrada:", {
      id: existingScale._id,
      fechas: `${existingScale.fechaInicial} - ${existingScale.fechaFinal}`,
      estado: existingScale.estado,
      metricas: existingScale.metricas?.length || 0,
    })

    // Eliminar físicamente de la base de datos
    const deletedScale = await Scale.findByIdAndDelete(id)

    if (!deletedScale) {
      console.error("❌ No se pudo eliminar la escala")
      return errorResponse(res, "No se pudo eliminar la escala", 500)
    }

    console.log("✅ Escala eliminada físicamente de la base de datos")
    console.log("🗑️ ===== FIN ELIMINACIÓN =====")

    return successResponse(
      res,
      {
        id: deletedScale._id,
        message: "Escala eliminada permanentemente de la base de datos",
      },
      "Escala eliminada exitosamente",
    )
  } catch (error) {
    console.error("❌ ERROR al eliminar escala:", error)
    console.error("❌ Error name:", error.name)
    console.error("❌ Error message:", error.message)

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al eliminar escala",
      error: error.message,
    })
  }
}

// Obtener escala vigente para una fecha específica
export const getActiveScaleByDate = async (req, res) => {
  try {
    const { date } = req.query
    const searchDate = date ? new Date(date) : new Date()

    const scale = await Scale.findByDate(searchDate)

    if (!scale) {
      return errorResponse(res, "No hay escala vigente para la fecha especificada", 404)
    }

    return successResponse(res, scale, "Escala vigente obtenida exitosamente")
  } catch (error) {
    console.error("Error al obtener escala vigente:", error)
    return handleError(res, error)
  }
}

// Evaluar una calificación con la escala vigente
export const evaluateScore = async (req, res) => {
  try {
    const { score, date } = req.body

    if (score === undefined || score === null) {
      return errorResponse(res, "La calificación es requerida", 400)
    }

    const searchDate = date ? new Date(date) : new Date()
    const scale = await Scale.findByDate(searchDate)

    if (!scale) {
      return errorResponse(res, "No hay escala vigente para evaluar la calificación", 404)
    }

    const evaluation = scale.evaluateScore(score)

    return successResponse(
      res,
      {
        calificacion: score,
        fecha: searchDate,
        escala: {
          id: scale._id,
          porcentajeAprobacion: scale.apruebaPorcentaje,
          totalMetricas: scale.metricas.length,
        },
        resultado: evaluation,
      },
      "Calificación evaluada exitosamente",
    )
  } catch (error) {
    console.error("Error al evaluar calificación:", error)
    return handleError(res, error)
  }
}

// Obtener estadísticas generales
export const getScaleStats = async (req, res) => {
  try {
    const stats = await Scale.aggregate([
      {
        $group: {
          _id: null,
          totalEscalas: { $sum: 1 },
          escalasActivas: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
          escalasInactivas: { $sum: { $cond: [{ $eq: ["$estado", "inactivo"] }, 1, 0] } },
          promedioAprobacion: { $avg: "$apruebaPorcentaje" },
          totalMetricas: { $sum: { $size: "$metricas" } },
        },
      },
    ])

    const currentScale = await Scale.findByDate(new Date())

    const response = {
      estadisticas: stats[0] || {
        totalEscalas: 0,
        escalasActivas: 0,
        escalasInactivas: 0,
        promedioAprobacion: 0,
        totalMetricas: 0,
      },
      escalaVigente: currentScale
        ? {
            id: currentScale._id,
            porcentajeAprobacion: currentScale.apruebaPorcentaje,
            totalMetricas: currentScale.metricas.length,
            vigencia: `${currentScale.fechaInicial.toISOString().split("T")[0]} - ${currentScale.fechaFinal.toISOString().split("T")[0]}`,
          }
        : null,
    }

    return successResponse(res, response, "Estadísticas obtenidas exitosamente")
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return handleError(res, error)
  }
}
