import mongoose, { model, Schema } from "mongoose";

const SupportMaterialSchema = new Schema({
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: [200, "El título no puede exceder 200 caracteres"],
    },
    contenido: {
      type: String,
      required: [true, "El contenido es obligatorio"],
    },
    tema: {
      type: String,
      required: [false, "El tema no es obligatorio"],
      trim: true,
    },
    estado: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
    fecha_actualizacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Índices para mejorar las consultas
SupportMaterialSchema.index({ tema: 1 })
SupportMaterialSchema.index({ estado: 1 })

// Middleware para actualizar fecha_actualizacion
SupportMaterialSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.fecha_actualizacion = new Date()
  }
  next()
})

export default mongoose.models.SupportMaterial || model('SupportMaterial', SupportMaterialSchema, 'supportMaterials');
