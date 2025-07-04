import mongoose from "mongoose"

const apprenticeProgressSchema = new mongoose.Schema(
  {
    // Referencia al aprendiz
    apprenticeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Asumiendo que los aprendices están en el modelo User
      required: true,
    },

    // Referencia a la ficha/curso
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Referencia a la programación del curso
    courseProgrammingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgramming",
      required: true,
    },

    // Nivel de inglés (1, 2, 3 para técnico; 1-6 para tecnólogo)
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },

    // Referencia a la evaluación
    evaluationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evaluation", // Asegúrate de que este sea el nombre correcto del modelo
      required: true,
    },

    // Información del intento de evaluación
    attemptNumber: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Puntaje obtenido
    score: {
      type: Number,
      required: true,
      min: 0,
    },

    // Puntaje máximo posible
    maxScore: {
      type: Number,
      required: true,
      min: 1,
    },

    // Porcentaje calculado
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    // Estado de aprobación
    passed: {
      type: Boolean,
      default: false,
    },

    // Tiempo empleado en minutos
    timeSpent: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Fecha de inicio
    startedAt: {
      type: Date,
      default: Date.now,
    },

    // Fecha de finalización
    completedAt: {
      type: Date,
    },

    // Respuestas detalladas (opcional)
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        answer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        points: Number,
      },
    ],

    // Retroalimentación del instructor
    feedback: {
      comment: String,
      instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      feedbackDate: Date,
    },

    // Estado del progreso
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
  },
  {
    timestamps: true,
  },
)

// Índices para optimizar consultas
apprenticeProgressSchema.index({ apprenticeId: 1, level: 1 })
apprenticeProgressSchema.index({ courseId: 1, level: 1 })
apprenticeProgressSchema.index({ apprenticeId: 1, evaluationId: 1 })

// Middleware para calcular porcentaje antes de guardar
apprenticeProgressSchema.pre("save", function (next) {
  if (this.score !== undefined && this.maxScore !== undefined) {
    this.percentage = Math.round((this.score / this.maxScore) * 100)

    // Determinar si aprobó (asumiendo 60% como mínimo)
    this.passed = this.percentage >= 60
  }
  next()
})

// Método estático para obtener progreso por aprendiz y nivel - CORREGIDO
apprenticeProgressSchema.statics.getProgressByApprenticeAndLevel = function (apprenticeId, level) {
  try {
    return this.find({ apprenticeId: new mongoose.Types.ObjectId(apprenticeId), level })
      .populate("evaluationId", "nombre tipoEvaluacion descripcion tematica") // Campos correctos
      .populate("apprenticeId", "nombre apellido")
      .sort({ createdAt: -1 })
  } catch (error) {
    console.error("Error in getProgressByApprenticeAndLevel:", error)
    throw error
  }
}

// Método estático para calcular estadísticas de progreso
apprenticeProgressSchema.statics.getProgressStatistics = function (apprenticeId, level) {
  try {
    return this.aggregate([
      {
        $match: {
          apprenticeId: new mongoose.Types.ObjectId(apprenticeId),
          level: Number(level),
        },
      },
      {
        $group: {
          _id: null,
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
          totalAttempts: 1,
          totalScore: 1,
          totalMaxScore: 1,
          passedAttempts: 1,
          failedAttempts: { $subtract: ["$totalAttempts", "$passedAttempts"] },
          passRate: {
            $cond: {
              if: { $eq: ["$totalAttempts", 0] },
              then: 0,
              else: { $round: [{ $multiply: [{ $divide: ["$passedAttempts", "$totalAttempts"] }, 100] }, 2] },
            },
          },
          averagePercentage: { $round: [{ $ifNull: ["$averagePercentage", 0] }, 2] },
          averageTimeSpent: { $round: [{ $ifNull: ["$averageTimeSpent", 0] }, 2] },
        },
      },
    ])
  } catch (error) {
    console.error("Error in getProgressStatistics:", error)
    throw error
  }
}

// Método estático para obtener progreso general por ficha
apprenticeProgressSchema.statics.getProgressByFicha = function (courseId) {
  try {
    return this.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: { apprenticeId: "$apprenticeId", level: "$level" },
          totalScore: { $sum: "$score" },
          totalMaxScore: { $sum: "$maxScore" },
          totalAttempts: { $sum: 1 },
          passedAttempts: { $sum: { $cond: ["$passed", 1, 0] } },
        },
      },
      {
        $project: {
          apprenticeId: "$_id.apprenticeId",
          level: "$_id.level",
          progressPercentage: {
            $cond: {
              if: { $eq: ["$totalMaxScore", 0] },
              then: 0,
              else: { $round: [{ $multiply: [{ $divide: ["$totalScore", "$totalMaxScore"] }, 100] }, 2] },
            },
          },
          totalAttempts: 1,
          passedAttempts: 1,
          _id: 0,
        },
      },
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
    console.error("Error in getProgressByFicha:", error)
    throw error
  }
}

export default mongoose.model("ApprenticeProgress", apprenticeProgressSchema)
