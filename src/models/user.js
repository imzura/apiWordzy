// #inicio modulos dickson
import mongoose from "mongoose"

// Esquema para fichas de instructores
const fichaInstructorSchema = new mongoose.Schema(
  {
    numero: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
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
          trim: true,
        },
        tipoDocumento: {
          type: String,
          required: true,
          enum: ["CC", "TI", "PPT", "PEP"],
        },
        estado: {
          type: String,
          enum: ["En formación", "Condicionado", "Retirado", "Graduado"],
          default: "En formación",
        },
      },
    ],
  },
  { _id: false },
)

// Esquema para progreso de niveles de aprendices
const progresoNivelSchema = new mongoose.Schema(
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
  { _id: false },
)

// Esquema principal de usuario unificado
const userSchema = new mongoose.Schema(
  {
    // Campo obligatorio para diferenciar tipos de usuario
    tipoUsuario: {
      type: String,
      required: [true, "El tipo de usuario es obligatorio"],
      enum: {
        values: ["aprendiz", "instructor"],
        message: 'El tipo de usuario debe ser "aprendiz" o "instructor"',
      },
      index: true,
    },

    // Campos comunes para ambos tipos
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      minlength: [2, "El apellido debe tener al menos 2 caracteres"],
      maxlength: [50, "El apellido no puede exceder 50 caracteres"],
    },
    documento: {
      type: String,
      required: [true, "El documento es obligatorio"],
      unique: true,
      trim: true,
      minlength: [6, "El documento debe tener al menos 6 caracteres"],
      maxlength: [20, "El documento no puede exceder 20 caracteres"],
    },
    tipoDocumento: {
      type: String,
      required: [true, "El tipo de documento es obligatorio"],
      enum: {
        values: ["CC", "TI", "PPT", "PEP"],
        message: "Tipo de documento no válido",
      },
    },
    estado: {
      type: String,
      required: [true, "El estado es obligatorio"],
      enum: {
        values: ["En formación", "Condicionado", "Retirado", "Graduado", "Activo", "Inactivo"],
        message: "Estado no válido",
      },
    },
    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"],
    },
    // NUEVO CAMPO: Contraseña para ambos tipos de usuario
    contraseña: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [1, "La contraseña debe tener al menos 1 carácter"],
    },

    // Campos específicos para APRENDICES
    ficha: [
      {
        type: Number,
        validate: {
          validator: (value) => Number.isInteger(value) && value > 0,
          message: "La ficha debe ser un número entero positivo",
        },
      },
    ],
    nivel: {
      type: Number,
      min: [1, "El nivel mínimo es 1"],
      max: [3, "El nivel máximo es 3"],
      default: 1,
    },
    programa: {
      type: String,
      trim: true,
      minlength: [2, "El programa debe tener al menos 2 caracteres"],
      maxlength: [100, "El programa no puede exceder 100 caracteres"],
    },
    progresoActual: {
      type: Number,
      default: 0,
      min: [0, "El progreso mínimo es 0"],
      max: [100, "El progreso máximo es 100"],
    },
    progresoNiveles: {
      type: [progresoNivelSchema],
      default: () => [
        { nivel: 1, porcentaje: 0 },
        { nivel: 2, porcentaje: 0 },
        { nivel: 3, porcentaje: 0 },
      ],
    },
    // NUEVO CAMPO: Puntos para aprendices
    puntos: {
      type: Number,
      default: 0,
      min: [0, "Los puntos no pueden ser negativos"],
      validate: {
        validator: Number.isInteger,
        message: "Los puntos deben ser un número entero",
      },
    },

    // Campos específicos para INSTRUCTORES
    fichas: {
      type: [fichaInstructorSchema],
      default: function () {
        if (this.tipoUsuario === "instructor") {
          return []
        }
        return undefined
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        // Limpiar campos no relevantes según el tipo
        if (ret.tipoUsuario === "aprendiz") {
          delete ret.fichas
        } else if (ret.tipoUsuario === "instructor") {
          delete ret.ficha
          delete ret.nivel
          delete ret.programa
          delete ret.progresoActual
          delete ret.progresoNiveles
          delete ret.puntos
        }
        return ret
      },
    },
  },
)

// Índices compuestos para optimizar consultas
userSchema.index({ tipoUsuario: 1, estado: 1 })
userSchema.index({ tipoUsuario: 1, documento: 1 })
userSchema.index({ tipoUsuario: 1, ficha: 1 })
userSchema.index({ tipoUsuario: 1, programa: 1 })

// Middleware pre-save para limpiar campos innecesarios
userSchema.pre("save", function (next) {
  if (this.tipoUsuario === "aprendiz") {
    this.fichas = undefined
  } else if (this.tipoUsuario === "instructor") {
    this.ficha = undefined
    this.nivel = undefined
    this.programa = undefined
    this.progresoActual = undefined
    this.progresoNiveles = undefined
    this.puntos = undefined
  }
  next()
})

// Método para obtener datos limpios según el tipo
userSchema.methods.toCleanJSON = function () {
  const obj = this.toObject()

  if (this.tipoUsuario === "aprendiz") {
    delete obj.fichas
  } else if (this.tipoUsuario === "instructor") {
    delete obj.ficha
    delete obj.nivel
    delete obj.programa
    delete obj.progresoActual
    delete obj.progresoNiveles
    delete obj.puntos
  }

  return obj
}

const User = mongoose.model("User", userSchema)

export default User
// #fin modulos dickson
