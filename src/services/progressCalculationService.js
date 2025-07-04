import mongoose from "mongoose"
import ApprenticeProgress from "../models/apprenticeProgress.js"

class ProgressCalculationService {
  /**
   * Calcula el progreso general de un aprendiz en un nivel específico
   */
  static async calculateLevelProgress(apprenticeId, level) {
    try {
      const statistics = await ApprenticeProgress.getProgressStatistics(apprenticeId, level)
      return statistics[0] || null
    } catch (error) {
      throw new Error(`Error calculando progreso del nivel: ${error.message}`)
    }
  }

  /**
   * Actualiza el progreso en el modelo de aprendiz
   */
  static async updateApprenticeProgress(apprenticeId) {
    try {
      // Importar dinámicamente el modelo User para evitar dependencias circulares
      const { default: User } = await import("../models/user.js")

      // Obtener progreso por cada nivel
      const progressByLevel = await ApprenticeProgress.aggregate([
        { $match: { apprenticeId: new mongoose.Types.ObjectId(apprenticeId) } },
        {
          $group: {
            _id: "$level",
            totalScore: { $sum: "$score" },
            totalMaxScore: { $sum: "$maxScore" },
            totalAttempts: { $sum: 1 },
            passedAttempts: { $sum: { $cond: ["$passed", 1, 0] } },
          },
        },
        {
          $project: {
            nivel: "$_id",
            porcentaje: {
              $round: [{ $multiply: [{ $divide: ["$totalScore", "$totalMaxScore"] }, 100] }, 0],
            },
            _id: 0,
          },
        },
      ])

      // Actualizar el campo progresoNiveles en el modelo User
      const progresoNiveles = progressByLevel.map((p) => ({
        nivel: p.nivel,
        porcentaje: p.porcentaje,
      }))

      // Calcular progreso actual (promedio de todos los niveles)
      const progresoActual =
        progresoNiveles.length > 0
          ? Math.round(progresoNiveles.reduce((sum, p) => sum + p.porcentaje, 0) / progresoNiveles.length)
          : 0

      await User.findByIdAndUpdate(apprenticeId, {
        progresoNiveles,
        progresoActual,
      })

      return { progresoNiveles, progresoActual }
    } catch (error) {
      throw new Error(`Error actualizando progreso del aprendiz: ${error.message}`)
    }
  }

  /**
   * Obtiene el ranking de aprendices por ficha
   */
  static async getFichaRanking(courseId) {
    try {
      return await ApprenticeProgress.aggregate([
        { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
        {
          $group: {
            _id: "$apprenticeId",
            totalScore: { $sum: "$score" },
            totalMaxScore: { $sum: "$maxScore" },
            totalAttempts: { $sum: 1 },
            passedAttempts: { $sum: { $cond: ["$passed", 1, 0] } },
          },
        },
        {
          $project: {
            apprenticeId: "$_id",
            totalScore: 1,
            overallPercentage: {
              $round: [{ $multiply: [{ $divide: ["$totalScore", "$totalMaxScore"] }, 100] }, 2],
            },
            passRate: {
              $round: [{ $multiply: [{ $divide: ["$passedAttempts", "$totalAttempts"] }, 100] }, 2],
            },
            _id: 0,
          },
        },
        { $sort: { overallPercentage: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "apprenticeId",
            foreignField: "_id",
            as: "apprentice",
          },
        },
        { $unwind: "$apprentice" },
      ])
    } catch (error) {
      throw new Error(`Error obteniendo ranking de ficha: ${error.message}`)
    }
  }

  /**
   * Calcula estadísticas generales por ficha
   */
  static async getFichaStatistics(courseId) {
    try {
      const statistics = await ApprenticeProgress.aggregate([
        { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
        {
          $group: {
            _id: null,
            totalApprentices: { $addToSet: "$apprenticeId" },
            totalAttempts: { $sum: 1 },
            totalScore: { $sum: "$score" },
            totalMaxScore: { $sum: "$maxScore" },
            passedAttempts: { $sum: { $cond: ["$passed", 1, 0] } },
            averagePercentage: { $avg: "$percentage" },
            averageTimeSpent: { $avg: "$timeSpent" },
          },
        },
        {
          $project: {
            _id: 0,
            totalApprentices: { $size: "$totalApprentices" },
            totalAttempts: 1,
            totalScore: 1,
            totalMaxScore: 1,
            passedAttempts: 1,
            failedAttempts: { $subtract: ["$totalAttempts", "$passedAttempts"] },
            passRate: {
              $round: [{ $multiply: [{ $divide: ["$passedAttempts", "$totalAttempts"] }, 100] }, 2],
            },
            averagePercentage: { $round: ["$averagePercentage", 2] },
            averageTimeSpent: { $round: ["$averageTimeSpent", 2] },
          },
        },
      ])

      return statistics[0] || null
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas de ficha: ${error.message}`)
    }
  }

  /**
   * Obtiene el progreso detallado de un aprendiz por nivel
   */
  static async getDetailedProgress(apprenticeId, level) {
    try {
      const progress = await ApprenticeProgress.find({ apprenticeId, level })
        .populate("evaluationId", "name type")
        .populate("apprenticeId", "nombre apellido")
        .sort({ createdAt: -1 })

      const statistics = await ApprenticeProgress.getProgressStatistics(apprenticeId, level)

      return {
        attempts: progress,
        statistics: statistics[0] || {
          totalAttempts: 0,
          totalScore: 0,
          totalMaxScore: 0,
          passedAttempts: 0,
          failedAttempts: 0,
          passRate: 0,
          averagePercentage: 0,
          averageTimeSpent: 0,
        },
      }
    } catch (error) {
      throw new Error(`Error obteniendo progreso detallado: ${error.message}`)
    }
  }

  /**
   * Valida si un aprendiz puede avanzar al siguiente nivel
   */
  static async canAdvanceToNextLevel(apprenticeId, currentLevel, minimumPassRate = 80) {
    try {
      const statistics = await ApprenticeProgress.getProgressStatistics(apprenticeId, currentLevel)
      const stats = statistics[0]

      if (!stats || stats.totalAttempts === 0) {
        return { canAdvance: false, reason: "No hay evaluaciones completadas en este nivel" }
      }

      if (stats.passRate < minimumPassRate) {
        return {
          canAdvance: false,
          reason: `Tasa de aprobación insuficiente: ${stats.passRate}% (mínimo requerido: ${minimumPassRate}%)`,
        }
      }

      return { canAdvance: true, reason: "Cumple con los requisitos para avanzar" }
    } catch (error) {
      throw new Error(`Error validando avance de nivel: ${error.message}`)
    }
  }
}

export default ProgressCalculationService
