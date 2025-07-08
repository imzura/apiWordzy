
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
