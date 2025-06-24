import mongoose, { model, Schema } from "mongoose"

const ProgramSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fk_level: {
      type: String,
      enum: ["TECNICO", "TECNÓLOGO", "ESPECIALIZACION", "AUXILIAR", "OPERARIO"],
      required: true,
    },
    fk_modality: {
      type: String,
      enum: ["PRESENCIAL", "A DISTANCIA", "VIRTUAL", "COMBINADO"],
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    abbreviation: {
      type: String,
      trim: true,
    },
    version: {
      type: String,
      trim: true,
    },
    externalId: {
      type: String,
      sparse: true, // Permite valores únicos pero también null/undefined
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// // Índices para mejorar rendimiento
// ProgramSchema.index({ code: 1 })
// ProgramSchema.index({ externalId: 1 })
ProgramSchema.index({ status: 1 })

export default mongoose.models.Program || model("Program", ProgramSchema, "programs")
