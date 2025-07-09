import ApprenticeProgress from "../models/apprenticeProgress.js"
import ProgressCalculationService from "../services/progressCalculationService.js"
import mongoose from "mongoose"
import { validationResult } from "express-validator"

// GET - Progreso por aprendiz y nivel - MEJORADO PARA COINCIDIR CON PROGRESSVIEW
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
      .populate("evaluationId", "nombre tipoEvaluacion descripcion tematica")
      .populate("apprenticeId", "nombre apellido documento correo telefono estado tipoDocumento")
      .populate("courseId", "code fk_programs")
      .sort({ createdAt: -1 })

    console.log(`✅ Progreso encontrado: ${progress.length} registros`)

    // NUEVA LÓGICA: Calcular estadísticas como ProgressView
    let statistics = {
      totalAttempts: progress.length,
      totalScore: 0,
      totalMaxScore: 0,
      passedAttempts: 0,
      failedAttempts: 0,
      passRate: 0,
      averagePercentage: 0,
      averageTimeSpent: 0,
      // Nuevas estadísticas que coinciden con ProgressView
      puntosAprobadas: 0,
      evaluacionesAprobadas: 0,
      evaluacionesProgramadas: 0,
    }

    if (progress.length > 0) {
      // Agrupar por evaluationId para obtener solo el último intento de cada evaluación
      const ultimosIntentosPorEvaluacion = new Map()

      progress.forEach((attempt) => {
        const evalId = attempt.evaluationId._id.toString()

        // Si no existe la evaluación o este intento es más reciente, actualizar
        if (
          !ultimosIntentosPorEvaluacion.has(evalId) ||
          new Date(attempt.createdAt) > new Date(ultimosIntentosPorEvaluacion.get(evalId).createdAt)
        ) {
          ultimosIntentosPorEvaluacion.set(evalId, attempt)
        }
      })

      // Convertir el Map a array - estos son los últimos intentos únicos
      const ultimosIntentosArray = Array.from(ultimosIntentosPorEvaluacion.values())

      console.log(`📊 Últimos intentos únicos: ${ultimosIntentosArray.length} de ${progress.length} totales`)

      // Calcular estadísticas basadas en últimos intentos
      let puntosAprobadas = 0
      let evaluacionesAprobadas = 0
      let totalTimeSpent = 0
      let totalPercentage = 0

      ultimosIntentosArray.forEach((attempt) => {
        // Solo contar si está aprobado (passed = true)
        if (attempt.passed) {
          puntosAprobadas += attempt.score || 0
          evaluacionesAprobadas++
          console.log(`✅ Evaluación aprobada: ${attempt.evaluationId.nombre} - ${attempt.score} puntos`)
        } else {
          console.log(`❌ Evaluación no aprobada: ${attempt.evaluationId.nombre} - ${attempt.score} puntos`)
        }

        totalTimeSpent += attempt.timeSpent || 0
        totalPercentage += attempt.percentage || 0
      })

      // Actualizar estadísticas
      statistics = {
        totalAttempts: progress.length, // Total de todos los intentos
        totalScore: progress.reduce((sum, p) => sum + (p.score || 0), 0),
        totalMaxScore: progress.reduce((sum, p) => sum + (p.maxScore || 0), 0),
        passedAttempts: progress.filter((p) => p.passed).length,
        failedAttempts: progress.filter((p) => !p.passed).length,
        passRate:
          progress.length > 0 ? Math.round((progress.filter((p) => p.passed).length / progress.length) * 100) : 0,
        averagePercentage:
          ultimosIntentosArray.length > 0 ? Math.round(totalPercentage / ultimosIntentosArray.length) : 0,
        averageTimeSpent:
          ultimosIntentosArray.length > 0 ? Math.round(totalTimeSpent / ultimosIntentosArray.length) : 0,

        // ESTADÍSTICAS CLAVE PARA PROGRESSVIEW
        puntosAprobadas: puntosAprobadas, // Solo puntos de evaluaciones aprobadas (últimos intentos)
        evaluacionesAprobadas: evaluacionesAprobadas, // Solo evaluaciones aprobadas (últimos intentos)
        evaluacionesProgramadas: ultimosIntentosArray.length, // Total de evaluaciones únicas realizadas
      }

      console.log(`📊 Estadísticas calculadas:`, {
        puntosAprobadas: statistics.puntosAprobadas,
        evaluacionesAprobadas: statistics.evaluacionesAprobadas,
        evaluacionesProgramadas: statistics.evaluacionesProgramadas,
        totalIntentos: statistics.totalAttempts,
      })
    }

    // Estructurar respuesta mejorada
    let apprenticeInfo = null
    const evaluations = []

    if (progress.length > 0) {
      // Extraer información del aprendiz una sola vez
      const firstRecord = progress[0]
      apprenticeInfo = {
        _id: firstRecord.apprenticeId._id,
        nombre: firstRecord.apprenticeId.nombre,
        apellido: firstRecord.apprenticeId.apellido,
        documento: firstRecord.apprenticeId.documento,
        correo: firstRecord.apprenticeId.correo,
        telefono: firstRecord.apprenticeId.telefono,
        estado: firstRecord.apprenticeId.estado,
        tipoDocumento: firstRecord.apprenticeId.tipoDocumento,
        ficha: {
          _id: firstRecord.courseId._id,
          code: firstRecord.courseId.code,
          programa: firstRecord.courseId.fk_programs,
        },
      }

      // Extraer solo las evaluaciones sin repetir datos del aprendiz
      progress.forEach((record) => {
        evaluations.push({
          _id: record._id,
          evaluationId: record.evaluationId,
          attemptNumber: record.attemptNumber,
          score: record.score,
          maxScore: record.maxScore,
          percentage: record.percentage,
          passed: record.passed,
          timeSpent: record.timeSpent,
          completedAt: record.completedAt,
          status: record.status,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          startedAt: record.startedAt,
          answers: record.answers,
        })
      })
    }

    res.json({
      success: true,
      data: {
        apprentice: apprenticeInfo,
        evaluations: evaluations,
        statistics: statistics,
        level: levelNum,
        totalEvaluations: evaluations.length,
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

// GET - Obtener todo el progreso con filtros - MEJORADO
export const getApprenticeProgress = async (req, res) => {
  try {
    const { apprenticeId, courseId, level, status, page = 1, limit = 10, grouped = false } = req.query

    console.log("🔍 Obteniendo progreso con filtros:", { apprenticeId, courseId, level, status, grouped })

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
      .populate("apprenticeId", "nombre apellido documento correo telefono estado tipoDocumento")
      .populate("evaluationId", "nombre tipoEvaluacion descripcion tematica")
      .populate("courseId", "code fk_programs")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await ApprenticeProgress.countDocuments(filters)

    console.log(`✅ Encontrados ${progress.length} registros de ${total} totales`)

    // Si se solicita agrupado, estructurar diferente
    if (grouped === "true" && apprenticeId) {
      const groupedData = {}

      progress.forEach((record) => {
        const apprenticeKey = record.apprenticeId._id.toString()

        if (!groupedData[apprenticeKey]) {
          groupedData[apprenticeKey] = {
            apprentice: {
              _id: record.apprenticeId._id,
              nombre: record.apprenticeId.nombre,
              apellido: record.apprenticeId.apellido,
              documento: record.apprenticeId.documento,
              correo: record.apprenticeId.correo,
              telefono: record.apprenticeId.telefono,
              estado: record.apprenticeId.estado,
              tipoDocumento: record.apprenticeId.tipoDocumento,
            },
            course: {
              _id: record.courseId._id,
              code: record.courseId.code,
              programa: record.courseId.fk_programs,
            },
            evaluations: [],
          }
        }

        groupedData[apprenticeKey].evaluations.push({
          _id: record._id,
          evaluationId: record.evaluationId,
          level: record.level,
          attemptNumber: record.attemptNumber,
          score: record.score,
          maxScore: record.maxScore,
          percentage: record.percentage,
          passed: record.passed,
          timeSpent: record.timeSpent,
          completedAt: record.completedAt,
          status: record.status,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          startedAt: record.startedAt,
        })
      })

      return res.json({
        success: true,
        data: Object.values(groupedData),
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / Number.parseInt(limit)),
          total,
        },
      })
    }

    // Respuesta normal (sin agrupar)
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      })
    }

    const progress = await ApprenticeProgress.findById(id)
      .populate("apprenticeId", "nombre apellido documento correo")
      .populate("evaluationId", "nombre tipoEvaluacion descripcion tematica")
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
      { path: "evaluationId", select: "nombre tipoEvaluacion descripcion" },
      { path: "courseId", select: "code fk_programs" },
    ])

    console.log("✅ Progreso creado exitosamente:", progress._id)

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      })
    }

    if (updateData.feedback && updateData.feedback.comment) {
      updateData.feedback.feedbackDate = new Date()
    }

    const progress = await ApprenticeProgress.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "apprenticeId", select: "nombre apellido" },
      { path: "evaluationId", select: "nombre tipoEvaluacion descripcion" },
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
      if (!mongoose.Types.ObjectId.isValid(apprenticeId)) {
        return res.status(400).json({
          success: false,
          message: "ID de aprendiz inválido",
        })
      }

      const stats = await ApprenticeProgress.getProgressStatistics(apprenticeId, Number.parseInt(level))
      statistics.apprenticeLevel = stats[0] || null
    }

    if (courseId) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: "ID de curso inválido",
        })
      }

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
