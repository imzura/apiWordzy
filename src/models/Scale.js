
import mongoose from "mongoose"

const metricaSchema = new mongoose.Schema(
  {
    rangoInicial: {
      type: Number,
      required: [true, "El rango inicial de la métrica es requerido"],
      min: [0, "El rango inicial debe ser mayor o igual a 0"],
      max: [100, "El rango inicial debe ser menor o igual a 100"],
    },
    rangoFinal: {
      type: Number,
      required: [true, "El rango final de la métrica es requerido"],
      min: [0, "El rango final debe ser mayor o igual a 0"],
      max: [100, "El rango final debe ser menor o igual a 100"],
      validate: {
        validator: function (value) {
          return value > this.rangoInicial
        },
        message: "El rango final debe ser mayor al rango inicial",
      },
    },
    concepto: {
      type: String,
      required: [true, "El concepto es requerido"],
      trim: true,
      maxlength: [100, "El concepto no puede exceder los 100 caracteres"],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, "La descripción no puede exceder los 500 caracteres"],
    },
  },
  { _id: false },
)

const scaleSchema = new mongoose.Schema(
  {
    fechaInicial: {
      type: Date,
      required: [true, "La fecha inicial es requerida"],
      validate: {
        validator: (value) => value instanceof Date && !isNaN(value),
        message: "La fecha inicial debe ser una fecha válida",
      },
    },
    fechaFinal: {
      type: Date,
      required: [true, "La fecha final es requerida"],
      validate: {
        validator: function (value) {
          return value instanceof Date && !isNaN(value) && value >= this.fechaInicial
        },
        message: "La fecha final debe ser posterior o igual a la fecha inicial",
      },
    },
    // Estos campos NO son requeridos para la escala principal
    rangoInicial: {
      type: Number,
      min: [0, "El rango inicial debe ser mayor o igual a 0"],
      max: [100, "El rango inicial debe ser menor o igual a 100"],
      default: 0,
    },
    rangoFinal: {
      type: Number,
      min: [0, "El rango final debe ser mayor o igual a 0"],
      max: [100, "El rango final debe ser menor o igual a 100"],
      default: 100,
    },
    valoracion: {
      type: String,
      enum: {
        values: ["Aprueba", "No aprueba"],
        message: 'La valoración debe ser "Aprueba" o "No aprueba"',
      },
      default: "Aprueba",
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [1000, "La descripción no puede exceder los 1000 caracteres"],
    },
    apruebaPorcentaje: {
      type: Number,
      required: [true, "El porcentaje de aprobación es requerido"],
      min: [0, "El porcentaje debe ser mayor o igual a 0"],
      max: [100, "El porcentaje debe ser menor o igual a 100"],
      default: 70,
    },
    // Las métricas SÍ usan rangoInicial y rangoFinal
    metricas: {
      type: [metricaSchema],
      default: [],
      validate: {
        validator: (metricas) => {
          if (!Array.isArray(metricas) || metricas.length === 0) return true

          // Validar que no haya solapamiento de rangos entre métricas
          for (let i = 0; i < metricas.length; i++) {
            for (let j = i + 1; j < metricas.length; j++) {
              const metrica1 = metricas[i]
              const metrica2 = metricas[j]

              // Verificar solapamiento
              if (metrica1.rangoInicial < metrica2.rangoFinal && metrica1.rangoFinal > metrica2.rangoInicial) {
                return false
              }
            }
          }
          return true
        },
        message: "Las métricas no pueden tener rangos que se solapen",
      },
    },
    estado: {
      type: String,
      enum: {
        values: ["activo", "inactivo"],
        message: 'El estado debe ser "activo" o "inactivo"',
      },
      default: "activo",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Índices para optimizar consultas
scaleSchema.index({ fechaInicial: 1, fechaFinal: 1 })
scaleSchema.index({ estado: 1 })
scaleSchema.index({ valoracion: 1 })

// Middleware para validar solapamiento de fechas con otras escalas - MEJORADO
scaleSchema.pre("save", async function (next) {
  try {
    if (this.isNew || this.isModified("fechaInicial") || this.isModified("fechaFinal")) {
      const overlappingScale = await this.constructor.findOne({
        _id: { $ne: this._id },
        estado: "activo",
        $or: [
          {
            fechaInicial: { $lte: this.fechaFinal },
            fechaFinal: { $gte: this.fechaInicial },
          },
        ],
      })

      if (overlappingScale) {
        const error = new Error("Ya existe una escala activa en el rango de fechas especificado")
        error.name = "ValidationError"
        return next(error)
      }
    }
    next()
  } catch (error) {
    next(error)
  }
})

// Método estático para encontrar escalas activas
scaleSchema.statics.findActive = function () {
  return this.find({ estado: "activo" }).sort({ fechaInicial: -1 })
}

// Método estático para encontrar escala por fecha
scaleSchema.statics.findByDate = function (date) {
  return this.findOne({
    estado: "activo",
    fechaInicial: { $lte: date },
    fechaFinal: { $gte: date },
  })
}

// Método para evaluar una calificación usando las métricas
scaleSchema.methods.evaluateScore = function (score) {
  // Buscar en métricas específicas
  for (const metrica of this.metricas) {
    if (score >= metrica.rangoInicial && score <= metrica.rangoFinal) {
      return {
        aprueba: score >= this.apruebaPorcentaje,
        concepto: metrica.concepto,
        descripcion: metrica.descripcion,
        valoracion: score >= this.apruebaPorcentaje ? "Aprueba" : "No aprueba",
        metrica: {
          rangoInicial: metrica.rangoInicial,
          rangoFinal: metrica.rangoFinal,
          concepto: metrica.concepto,
        },
      }
    }
  }

  // Si no hay métricas o no coincide con ninguna
  return {
    aprueba: score >= this.apruebaPorcentaje,
    concepto: score >= this.apruebaPorcentaje ? "Aprobado" : "No aprobado",
    valoracion: score >= this.apruebaPorcentaje ? "Aprueba" : "No aprueba",
    mensaje: "Evaluación general sin métrica específica",
  }
}

// Método para obtener estadísticas
scaleSchema.methods.getStats = function () {
  return {
    porcentajeAprobacion: this.apruebaPorcentaje,
    totalMetricas: this.metricas.length,
    vigencia: {
      inicio: this.fechaInicial,
      fin: this.fechaFinal,
      diasVigencia: Math.ceil((this.fechaFinal - this.fechaInicial) / (1000 * 60 * 60 * 24)),
    },
    rangosMetricas: this.metricas.map((m) => ({
      concepto: m.concepto,
      rango: `${m.rangoInicial}-${m.rangoFinal}%`,
    })),
  }
}

const Scale = mongoose.model("Scale", scaleSchema)

export default Scale
