// #inicio modulos dickson
import mongoose from "mongoose"

// Esquema principal de usuario unificado
const userSchema = new mongoose.Schema(
  {
    // Campo obligatorio para diferenciar tipos de usuario
    tipoUsuario: {
      type: String,
      required: [true, "El tipo de usuario es obligatorio"],
      enum: ["aprendiz", "instructor", "administrador"],
      index: true,
    },

    // Campos comunes para ambos tipos
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
      enum: ["En formación", "Condicionado", "Retirado", "Graduado", "Activo", "Inactivo"],
    },
    telefono: {
      type: String,
      required: true,
      trim: true,
    },
    correo: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"],
    },
    contraseña: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    // --- CAMPOS DE APRENDIZ MODIFICADOS ---
    ficha: [
      {
        type: Number,
        validate: {
          validator: (value) => Number.isInteger(value) && value > 0,
          message: "La ficha debe ser un número entero positivo",
        },
      },
    ],
    programa: {
      type: String,
      trim: true,
    },
    // CAMBIO: Se mantiene para el cálculo general que hará el servicio.
    progresoActual: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    puntos: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Los puntos deben ser un número entero",
      },
    },
    // ELIMINADO: El campo `nivel` y `progresoNiveles` ya no están embebidos.

    // --- CAMPOS DE INSTRUCTOR ---
    fichas: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
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
          delete ret.programa
          delete ret.progresoActual
          delete ret.puntos
        } else if (ret.tipoUsuario === "administrador") {
          delete ret.ficha
          delete ret.programa
          delete ret.progresoActual
          delete ret.puntos
          delete ret.fichas
        }
        return ret
      },
    },
  },
)

// Índices
userSchema.index({ tipoUsuario: 1, estado: 1 })
userSchema.index({ tipoUsuario: 1, documento: 1 })
userSchema.index({ tipoUsuario: 1, ficha: 1 })

// Middleware pre-save para limpiar campos innecesarios
userSchema.pre("save", function (next) {
  if (this.tipoUsuario === "aprendiz") {
    this.fichas = undefined
  } else if (this.tipoUsuario === "instructor") {
    this.ficha = undefined
    this.programa = undefined
    this.progresoActual = undefined
    this.puntos = undefined
  } else if (this.tipoUsuario === "administrador") {
    this.ficha = undefined
    this.programa = undefined
    this.progresoActual = undefined
    this.puntos = undefined
    this.fichas = undefined
  }
  next()
})

// Método para obtener datos limpios según el tipo
userSchema.methods.toCleanJSON = function () {
  const obj = this.toObject()
  // CAMBIO: Se añade el campo `progresoNiveles` que se calculará dinámicamente
  if (this.progresoNiveles) {
    obj.progresoNiveles = this.progresoNiveles
  }

  if (this.tipoUsuario === "aprendiz") {
    delete obj.fichas
  } else if (this.tipoUsuario === "instructor") {
    delete obj.ficha
    delete obj.programa
    delete obj.puntos
  } else if (this.tipoUsuario === "administrador") {
    delete obj.ficha
    delete obj.programa
    delete obj.puntos
    delete obj.fichas
  }

  return obj
}

const User = mongoose.model("User", userSchema)

export default User
// #fin modulos dickson
