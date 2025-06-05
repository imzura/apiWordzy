import mongoose from "mongoose"

const apprenticeSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    documento: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    tipoDocumento: {
      type: String,
      required: true,
      enum: ["CC", "TI", "PPT", "PEP"],
    },
    ficha: [
      {
        type: Number,
        required: true,
      },
    ],
    nivel: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
      default: 1,
    },
    estado: {
      type: String,
      required: true,
      enum: ["En formación", "Condicionado", "Retirado", "Graduado"],
      default: "En formación",
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    programa: {
      type: String,
      required: true,
      trim: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"],
    },
    progresoActual: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    progresoNiveles: [
      {
        nivel: {
          type: Number,
          required: true,
          min: 1,
          max: 3,
        },
        porcentaje: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Índices para mejorar rendimiento
apprenticeSchema.index({ documento: 1 })
apprenticeSchema.index({ correo: 1 })
apprenticeSchema.index({ ficha: 1 })
apprenticeSchema.index({ estado: 1 })

const Apprentice = mongoose.model("Apprentice", apprenticeSchema)

export default Apprentice
