import mongoose, { model, Schema } from "mongoose"

const FichaLevelAssignmentSchema = new Schema(
  {
    // Cambiar courseId por fichaId para coincidir con el índice existente
    fichaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    fichaCode: {
      type: String,
      required: true,
      trim: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    programmingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgramming",
      required: false,
    },
    // Cambiar levels a un objeto dinámico en lugar de estructura fija
    levels: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastModifiedBy: {
      type: String,
      required: true,
    },
    lastModifiedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Índices para optimizar consultas
FichaLevelAssignmentSchema.index({ fichaId: 1 })
FichaLevelAssignmentSchema.index({ fichaCode: 1 })
FichaLevelAssignmentSchema.index({ programId: 1 })
FichaLevelAssignmentSchema.index({ programmingId: 1 })
FichaLevelAssignmentSchema.index({ status: 1 })

// Índice compuesto único para evitar duplicados (coincidir con el existente)
FichaLevelAssignmentSchema.index({ fichaId: 1, fichaCode: 1 }, { unique: true })

export default mongoose.models.FichaLevelAssignment ||
  model("FichaLevelAssignment", FichaLevelAssignmentSchema, "ficha_level_assignments")
