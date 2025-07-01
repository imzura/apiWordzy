import ApprenticeProgress from "../models/apprenticeProgress.js"
import ProgressCalculationService from "../services/progressCalculationService.js"
import mongoose from "mongoose"
import { validationResult } from "express-validator"

// GET - Progreso por aprendiz y nivel
export const getProgressByApprenticeAndLevel = async (req, res) => {
  try {
    const { apprenticeId, level } = req.params

    console.log(`🔍 Buscando progreso para aprendiz: ${apprenticeId}, nivel: ${level}`)

    // Validar que el apprenticeId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(apprenticeId)) {
      console.error("❌ ID de aprendiz inválido:", apprenticeId)
      return res.status(400).json({
        success: false,
        message: "ID de aprendiz inválido",
      })
    }

    // Validar nivel
    const levelNum = Number.parseInt(level)
    if (isNaN(levelNum) || levelNum < 1 || levelNum > 6) {
      console.error("❌ Nivel inválido:", level)
      return res.status(400).json({
        success: false,
        message: "Nivel debe ser un número entre 1 y 6",
      })
    }

    // Obtener progreso con populate corregido
    const progress = await ApprenticeProgress.find({
      apprenticeId: new mongoose.Types.ObjectId(apprenticeId),
      level: levelNum,
    })
      .populate("evaluationId", "nombre tipoEvaluacion descripcion tematica") // Campos correctos del modelo
      .populate("apprenticeId", "nombre apellido")
      .sort({ createdAt: -1 })

    console.log(`✅ Progreso encontrado: ${progress.length} registros`)
    console.log(
      "📋 Datos de evaluación:",
      progress.map((p) => ({
        id: p._id,
        evaluacion: p.evaluationId
          ? {
              nombre: p.evaluationId.nombre,
              tipo: p.evaluationId.tipoEvaluacion,
            }
          : null,
      })),
    )

    // Obtener estadísticas
    let statistics = null
    try {
      const stats = await ApprenticeProgress.getProgressStatistics(apprenticeId, levelNum)
      statistics = stats[0] || {
        totalAttempts: 0,
        totalScore: 0,
        totalMaxScore: 0,
        passedAttempts: 0,
        failedAttempts: 0,
        passRate: 0,
        averagePercentage: 0,
        averageTimeSpent: 0,
      }
      console.log("✅ Estadísticas calculadas:", statistics)
    } catch (statsError) {
      console.warn("⚠️ Error calculando estadísticas:", statsError.message)
      statistics = {
        totalAttempts: 0,
        totalScore: 0,
        totalMaxScore: 0,
        passedAttempts: 0,
        failedAttempts: 0,
        passRate: 0,
        averagePercentage: 0,
        averageTimeSpent: 0,
      }
    }

    res.json({
      success: true,
      data: {
        attempts: progress,
        statistics: statistics,
      },
    })
  } catch (error) {
    console.error("❌ Error al obtener el progreso del aprendiz:", error)
    res.status(500).json({
      success: false,
      message: "Error al obtener el progreso del aprendiz",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

// GET - Obtener todo el progreso con filtros
export const getApprenticeProgress = async (req, res) => {
  try {
    const { apprenticeId, courseId, level, status, page = 1, limit = 10 } = req.query

    console.log("🔍 Obteniendo progreso con filtros:", { apprenticeId, courseId, level, status })

    // Construir filtros
    const filters = {}
    if (apprenticeId) {
      if (!mongoose.Types.ObjectId.isValid(apprenticeId)) {
        return res.status(400).json({
          success: false,
          message: "ID de aprendiz inválido",
        })
      }
      filters.apprenticeId = apprenticeId
    }
    if (courseId) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: "ID de curso inválido",
        })
      }
      filters.courseId = courseId
    }
    if (level) filters.level = Number.parseInt(level)
    if (status) filters.status = status

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const progress = await ApprenticeProgress.find(filters)
      .populate("apprenticeId", "nombre apellido documento correo")
      .populate("evaluationId", "nombre tipoEvaluacion descripcion tematica") // Campos correctos
      .populate("courseId", "code fk_programs")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await ApprenticeProgress.countDocuments(filters)

    console.log(`✅ Encontrados ${progress.length} registros de ${total} totales`)

    res.json({
      success: true,
      data: progress,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / Number.parseInt(limit)),
        total,
      },
    })
  } catch (error) {
    console.error("❌ Error al obtener el progreso:", error)
    res.status(500).json({
      success: false,
      message: "Error al obtener el progreso",
      error: error.message,
    })
  }
}

// GET - Progreso por ficha/curso
export const getProgressByCourse = async (req, res) => {
  try {
    const { courseId } = req.params

    console.log(`🔍 Obteniendo progreso para curso: ${courseId}`)

    // Validar que el courseId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "ID de curso inválido",
      })
    }

    const progress = await ApprenticeProgress.getProgressByFicha(courseId)

    console.log(`✅ Progreso de ficha encontrado: ${progress.length} registros`)

    res.json({
      success: true,
      data: progress,
    })
  } catch (error) {
    console.error("❌ Error al obtener el progreso de la ficha:", error)
    res.status(500).json({
      success: false,
      message: "Error al obtener el progreso de la ficha",
      error: error.message,
    })
  }
}

// GET - Obtener progreso por ID
export const getProgressById = async (req, res) => {
  try {
    const { id } = req.params

    // Validar que el id sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      })
    }

    const progress = await ApprenticeProgress.findById(id)
      .populate("apprenticeId", "nombre apellido documento correo")
      .populate("evaluationId", "nombre tipoEvaluacion descripcion tematica") // Campos correctos
      .populate("courseId", "code fk_programs")
      .populate("feedback.instructorId", "nombre apellido")

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Registro de progreso no encontrado",
      })
    }

    res.json({
      success: true,
      data: progress,
    })
  } catch (error) {
    console.error("❌ Error al obtener el progreso por ID:", error)
    res.status(500).json({
      success: false,
      message: "Error al obtener el progreso",
      error: error.message,
    })
  }
}

// POST - Crear nuevo registro de progreso
export const createApprenticeProgress = async (req, res) => {
  try {
    // Manejar errores de validación
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      })
    }

    const progressData = req.body

    console.log("🔍 Creando nuevo progreso:", progressData)

    // Verificar si ya existe un intento para esta evaluación
    const existingAttempts = await ApprenticeProgress.countDocuments({
      apprenticeId: progressData.apprenticeId,
      evaluationId: progressData.evaluationId,
      level: progressData.level,
    })

    progressData.attemptNumber = existingAttempts + 1
    progressData.completedAt = new Date()
    progressData.status = "completed"

    const progress = new ApprenticeProgress(progressData)
    await progress.save()

    await progress.populate([
      { path: "apprenticeId", select: "nombre apellido" },
      { path: "evaluationId", select: "nombre tipoEvaluacion descripcion" }, // Campos correctos
      { path: "courseId", select: "code fk_programs" },
    ])

    console.log("✅ Progreso creado exitosamente:", progress._id)

    // Actualizar el progreso general del aprendiz
    try {
      await ProgressCalculationService.updateApprenticeProgress(progressData.apprenticeId)
    } catch (updateError) {
      console.warn("⚠️ Error actualizando progreso general:", updateError.message)
    }

    res.status(201).json({
      success: true,
      message: "Progreso registrado exitosamente",
      data: progress,
    })
  } catch (error) {
    console.error("❌ Error al registrar el progreso:", error)
    res.status(500).json({
      success: false,
      message: "Error al registrar el progreso",
      error: error.message,
    })
  }
}

// PUT - Actualizar progreso
export const updateApprenticeProgress = async (req, res) => {
  try {
    // Manejar errores de validación
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array(),
      })
    }

    const { id } = req.params
    const updateData = req.body

    console.log(`🔍 Actualizando progreso: ${id}`, updateData)

    // Validar que el id sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      })
    }

    // Si se está agregando retroalimentación, agregar fecha
    if (updateData.feedback && updateData.feedback.comment) {
      updateData.feedback.feedbackDate = new Date()
    }

    const progress = await ApprenticeProgress.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "apprenticeId", select: "nombre apellido" },
      { path: "evaluationId", select: "nombre tipoEvaluacion descripcion" }, // Campos correctos
      { path: "courseId", select: "code fk_programs" },
      { path: "feedback.instructorId", select: "nombre apellido" },
    ])

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Registro de progreso no encontrado",
      })
    }

    console.log("✅ Progreso actualizado exitosamente")

    // Si se actualizó el puntaje, recalcular progreso general
    if (updateData.score !== undefined) {
      try {
        await ProgressCalculationService.updateApprenticeProgress(progress.apprenticeId._id)
      } catch (updateError) {
        console.warn("⚠️ Error actualizando progreso general:", updateError.message)
      }
    }

    res.json({
      success: true,
      message: "Progreso actualizado exitosamente",
      data: progress,
    })
  } catch (error) {
    console.error("❌ Error al actualizar el progreso:", error)
    res.status(500).json({
      success: false,
      message: "Error al actualizar el progreso",
      error: error.message,
    })
  }
}

// DELETE - Eliminar progreso
export const deleteApprenticeProgress = async (req, res) => {
  try {
    const { id } = req.params

    console.log(`🔍 Eliminando progreso: ${id}`)

    // Validar que el id sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      })
    }

    const progress = await ApprenticeProgress.findByIdAndDelete(id)

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Registro de progreso no encontrado",
      })
    }

    console.log("✅ Progreso eliminado exitosamente")

    // Recalcular progreso general del aprendiz después de eliminar
    try {
      await ProgressCalculationService.updateApprenticeProgress(progress.apprenticeId)
    } catch (updateError) {
      console.warn("⚠️ Error actualizando progreso general:", updateError.message)
    }

    res.json({
      success: true,
      message: "Progreso eliminado exitosamente",
    })
  } catch (error) {
    console.error("❌ Error al eliminar el progreso:", error)
    res.status(500).json({
      success: false,
      message: "Error al eliminar el progreso",
      error: error.message,
    })
  }
}

// GET - Obtener ranking de aprendices por ficha
export const getFichaRanking = async (req, res) => {
  try {
    const { courseId } = req.params

    console.log(`🔍 Obteniendo ranking para curso: ${courseId}`)

    // Validar que el courseId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "ID de curso inválido",
      })
    }

    const ranking = await ProgressCalculationService.getFichaRanking(courseId)

    console.log(`✅ Ranking obtenido: ${ranking.length} aprendices`)

    res.json({
      success: true,
      data: ranking,
    })
  } catch (error) {
    console.error("❌ Error al obtener ranking de ficha:", error)
    res.status(500).json({
      success: false,
      message: "Error al obtener ranking de ficha",
      error: error.message,
    })
  }
}

// GET - Obtener estadísticas generales de progreso
export const getProgressStatistics = async (req, res) => {
  try {
    const { apprenticeId, level, courseId } = req.query

    console.log("🔍 Obteniendo estadísticas:", { apprenticeId, level, courseId })

    const statistics = {}

    if (apprenticeId && level) {
      // Validar que el apprenticeId sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(apprenticeId)) {
        return res.status(400).json({
          success: false,
          message: "ID de aprendiz inválido",
        })
      }

      // Estadísticas por aprendiz y nivel
      const stats = await ApprenticeProgress.getProgressStatistics(apprenticeId, Number.parseInt(level))
      statistics.apprenticeLevel = stats[0] || null
    }

    if (courseId) {
      // Validar que el courseId sea un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: "ID de curso inválido",
        })
      }

      // Estadísticas generales por ficha
      const fichaStats = await ProgressCalculationService.getFichaStatistics(courseId)
      statistics.ficha = fichaStats
    }

    console.log("✅ Estadísticas obtenidas")

    res.json({
      success: true,
      data: statistics,
    })
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error)
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    })
  }
}
