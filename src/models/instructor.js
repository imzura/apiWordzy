import mongoose from "mongoose"

const fichaSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
  },
  nivel: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  programa: {
    type: String,
    required: true,
  },
  fechaInicio: {
    type: String,
    required: true,
  },
  fechaFin: {
    type: String,
    required: true,
  },
  estudiantes: [
    {
      nombre: String,
      apellido: String,
      documento: String,
      tipoDocumento: String,
      estado: {
        type: String,
        enum: ["En formación", "Condicionado", "Retirado", "Graduado"],
        default: "En formación",
      },
    },
  ],
})

const instructorSchema = new mongoose.Schema(
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
    estado: {
      type: String,
      required: true,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
    telefono: {
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
    fichas: [fichaSchema],
  },
  {
    timestamps: true,
  },
)

// Índices para mejorar rendimiento
instructorSchema.index({ documento: 1 })
instructorSchema.index({ correo: 1 })
instructorSchema.index({ estado: 1 })
instructorSchema.index({ "fichas.numero": 1 })
instructorSchema.index({ "fichas.nivel": 1 })

const Instructor = mongoose.model("Instructor", instructorSchema)

export default Instructor
