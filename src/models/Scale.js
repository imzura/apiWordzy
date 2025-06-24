// // // // // // // // const mongoose = require("mongoose")

// // // // // // // // const scaleMetricSchema = new mongoose.Schema(
// // // // // // // //   {
// // // // // // // //     nombre: {
// // // // // // // //       type: String,
// // // // // // // //       required: [true, "El nombre de la métrica es requerido"],
// // // // // // // //       trim: true,
// // // // // // // //       maxlength: [255, "El nombre no puede exceder 255 caracteres"],
// // // // // // // //     },
// // // // // // // //     descripcion: {
// // // // // // // //       type: String,
// // // // // // // //       trim: true,
// // // // // // // //     },
// // // // // // // //     valor_minimo: {
// // // // // // // //       type: Number,
// // // // // // // //       required: [true, "El valor mínimo es requerido"],
// // // // // // // //       min: [0, "El valor mínimo no puede ser negativo"],
// // // // // // // //       validate: {
// // // // // // // //         validator: function (v) {
// // // // // // // //           return v < this.valor_maximo
// // // // // // // //         },
// // // // // // // //         message: "El valor mínimo debe ser menor que el valor máximo",
// // // // // // // //       },
// // // // // // // //     },
// // // // // // // //     valor_maximo: {
// // // // // // // //       type: Number,
// // // // // // // //       required: [true, "El valor máximo es requerido"],
// // // // // // // //       min: [0, "El valor máximo no puede ser negativo"],
// // // // // // // //     },
// // // // // // // //     peso: {
// // // // // // // //       type: Number,
// // // // // // // //       default: 1.0,
// // // // // // // //       min: [0, "El peso no puede ser negativo"],
// // // // // // // //       max: [100, "El peso no puede exceder 100"],
// // // // // // // //     },
// // // // // // // //     orden: {
// // // // // // // //       type: Number,
// // // // // // // //       default: 1,
// // // // // // // //       min: [1, "El orden debe ser mayor a 0"],
// // // // // // // //     },
// // // // // // // //     estado: {
// // // // // // // //       type: String,
// // // // // // // //       enum: {
// // // // // // // //         values: ["activo", "inactivo"],
// // // // // // // //         message: "El estado debe ser activo o inactivo",
// // // // // // // //       },
// // // // // // // //       default: "activo",
// // // // // // // //     },
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     timestamps: true,
// // // // // // // //   },
// // // // // // // // )

// // // // // // // // const scaleSchema = new mongoose.Schema(
// // // // // // // //   {
// // // // // // // //     nombre: {
// // // // // // // //       type: String,
// // // // // // // //       required: [true, "El nombre es requerido"],
// // // // // // // //       trim: true,
// // // // // // // //       maxlength: [255, "El nombre no puede exceder 255 caracteres"],
// // // // // // // //     },
// // // // // // // //     descripcion: {
// // // // // // // //       type: String,
// // // // // // // //       trim: true,
// // // // // // // //     },
// // // // // // // //     fecha_inicial: {
// // // // // // // //       type: Date,
// // // // // // // //       required: [true, "La fecha inicial es requerida"],
// // // // // // // //     },
// // // // // // // //     fecha_final: {
// // // // // // // //       type: Date,
// // // // // // // //       required: [true, "La fecha final es requerida"],
// // // // // // // //       validate: {
// // // // // // // //         validator: function (v) {
// // // // // // // //           return v > this.fecha_inicial
// // // // // // // //         },
// // // // // // // //         message: "La fecha final debe ser posterior a la fecha inicial",
// // // // // // // //       },
// // // // // // // //     },
// // // // // // // //     estado: {
// // // // // // // //       type: String,
// // // // // // // //       enum: {
// // // // // // // //         values: ["activo", "inactivo"],
// // // // // // // //         message: "El estado debe ser activo o inactivo",
// // // // // // // //       },
// // // // // // // //       default: "activo",
// // // // // // // //     },
// // // // // // // //     metrics: [scaleMetricSchema],
// // // // // // // //     creado_por: {
// // // // // // // //       type: mongoose.Schema.Types.ObjectId,
// // // // // // // //       ref: "User",
// // // // // // // //       required: [true, "El creador es requerido"],
// // // // // // // //     },
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     timestamps: {
// // // // // // // //       createdAt: "fecha_creacion",
// // // // // // // //       updatedAt: "fecha_actualizacion",
// // // // // // // //     },
// // // // // // // //     toJSON: { virtuals: true },
// // // // // // // //     toObject: { virtuals: true },
// // // // // // // //   },
// // // // // // // // )

// // // // // // // // // Índices para mejorar el rendimiento
// // // // // // // // scaleSchema.index({ estado: 1 })
// // // // // // // // scaleSchema.index({ fecha_inicial: 1 })
// // // // // // // // scaleSchema.index({ fecha_final: 1 })
// // // // // // // // scaleSchema.index({ fecha_creacion: -1 })

// // // // // // // // module.exports = mongoose.model("Scale", scaleSchema)
// // // // // // // const mongoose = require("mongoose")

// // // // // // // const metricSchema = new mongoose.Schema({
// // // // // // //   nombre: {
// // // // // // //     type: String,
// // // // // // //     required: [true, "El nombre de la métrica es requerido"],
// // // // // // //     trim: true,
// // // // // // //     maxlength: [255, "El nombre no puede exceder 255 caracteres"],
// // // // // // //   },
// // // // // // //   descripcion: {
// // // // // // //     type: String,
// // // // // // //     trim: true,
// // // // // // //     maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
// // // // // // //     default: "",
// // // // // // //   },
// // // // // // //   valor_minimo: {
// // // // // // //     type: Number,
// // // // // // //     required: [true, "El valor mínimo es requerido"],
// // // // // // //     min: [0, "El valor mínimo debe ser mayor o igual a 0"],
// // // // // // //   },
// // // // // // //   valor_maximo: {
// // // // // // //     type: Number,
// // // // // // //     required: [true, "El valor máximo es requerido"],
// // // // // // //     validate: {
// // // // // // //       validator: function (value) {
// // // // // // //         return value >= this.valor_minimo
// // // // // // //       },
// // // // // // //       message: "El valor máximo debe ser mayor al valor mínimo",
// // // // // // //     },
// // // // // // //   },
// // // // // // //   peso: {
// // // // // // //     type: Number,
// // // // // // //     min: [0, "El peso debe ser mayor o igual a 0"],
// // // // // // //     max: [100, "El peso no puede exceder 100"],
// // // // // // //     default: 1.0,
// // // // // // //   },
// // // // // // //   orden: {
// // // // // // //     type: Number,
// // // // // // //     min: [1, "El orden debe ser mayor a 0"],
// // // // // // //     default: 1,
// // // // // // //   },
// // // // // // //   estado: {
// // // // // // //     type: String,
// // // // // // //     enum: {
// // // // // // //       values: ["activo", "inactivo"],
// // // // // // //       message: "El estado debe ser activo o inactivo",
// // // // // // //     },
// // // // // // //     default: "activo",
// // // // // // //   },
// // // // // // // })

// // // // // // // const scaleSchema = new mongoose.Schema(
// // // // // // //   {
// // // // // // //     nombre: {
// // // // // // //       type: String,
// // // // // // //       required: [true, "El nombre es requerido"],
// // // // // // //       trim: true,
// // // // // // //       maxlength: [255, "El nombre no puede exceder 255 caracteres"],
// // // // // // //     },
// // // // // // //     descripcion: {
// // // // // // //       type: String,
// // // // // // //       trim: true,
// // // // // // //       maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
// // // // // // //       default: "",
// // // // // // //     },
// // // // // // //     fechaInicial: {
// // // // // // //       type: Date,
// // // // // // //       required: [true, "La fecha inicial es requerida"],
// // // // // // //     },
// // // // // // //     fechaFinal: {
// // // // // // //       type: Date,
// // // // // // //       required: [true, "La fecha final es requerida"],
// // // // // // //       validate: {
// // // // // // //         validator: function (value) {
// // // // // // //           return value >= this.fechaInicial
// // // // // // //         },
// // // // // // //         message: "La fecha final debe ser posterior a la fecha inicial",
// // // // // // //       },
// // // // // // //     },
// // // // // // //     apruebaPorcentaje: {
// // // // // // //       type: Number,
// // // // // // //       required: [true, "El porcentaje de aprobación es requerido"],
// // // // // // //       min: [0, "El porcentaje debe ser mayor o igual a 0"],
// // // // // // //       max: [100, "El porcentaje no puede exceder 100"],
// // // // // // //       default: 70,
// // // // // // //     },
// // // // // // //     rangoInicial: {
// // // // // // //       type: Number,
// // // // // // //       min: [0, "El rango inicial debe ser mayor o igual a 0"],
// // // // // // //       max: [100, "El rango inicial no puede exceder 100"],
// // // // // // //       default: 0,
// // // // // // //     },
// // // // // // //     rangoFinal: {
// // // // // // //       type: Number,
// // // // // // //       min: [0, "El rango final debe ser mayor o igual a 0"],
// // // // // // //       max: [100, "El rango final no puede exceder 100"],
// // // // // // //       default: 100,
// // // // // // //     },
// // // // // // //     valoracion: {
// // // // // // //       type: String,
// // // // // // //       enum: {
// // // // // // //         values: ["Aprueba", "No aprueba"],
// // // // // // //         message: "La valoración debe ser Aprueba o No aprueba",
// // // // // // //       },
// // // // // // //       default: "Aprueba",
// // // // // // //     },
// // // // // // //     estado: {
// // // // // // //       type: String,
// // // // // // //       enum: {
// // // // // // //         values: ["activo", "inactivo"],
// // // // // // //         message: "El estado debe ser activo o inactivo",
// // // // // // //       },
// // // // // // //       default: "activo",
// // // // // // //     },
// // // // // // //     metricas: [metricSchema],
// // // // // // //     creado_por: {
// // // // // // //       type: mongoose.Schema.Types.ObjectId,
// // // // // // //       ref: "User",
// // // // // // //       // No requerido para permitir creación sin autenticación temporal
// // // // // // //     },
// // // // // // //   },
// // // // // // //   {
// // // // // // //     timestamps: {
// // // // // // //       createdAt: "fecha_creacion",
// // // // // // //       updatedAt: "fecha_actualizacion",
// // // // // // //     },
// // // // // // //   },
// // // // // // // )

// // // // // // // // Índices para mejorar rendimiento
// // // // // // // scaleSchema.index({ fechaInicial: 1, fechaFinal: 1 })
// // // // // // // scaleSchema.index({ estado: 1 })
// // // // // // // scaleSchema.index({ fecha_creacion: -1 })

// // // // // // // module.exports = mongoose.model("Scale", scaleSchema)
// // // // // // const mongoose = require("mongoose")

// // // // // // const metricSchema = new mongoose.Schema({
// // // // // //   id: {
// // // // // //     type: Number,
// // // // // //     required: false,
// // // // // //   },
// // // // // //   rangoInicial: {
// // // // // //     type: Number,
// // // // // //     required: [true, "El rango inicial es requerido"],
// // // // // //     min: [0, "El rango inicial debe ser mayor o igual a 0"],
// // // // // //     max: [100, "El rango inicial no puede exceder 100"],
// // // // // //   },
// // // // // //   rangoFinal: {
// // // // // //     type: Number,
// // // // // //     required: [true, "El rango final es requerido"],
// // // // // //     min: [0, "El rango final debe ser mayor o igual a 0"],
// // // // // //     max: [100, "El rango final no puede exceder 100"],
// // // // // //     validate: {
// // // // // //       validator: function (value) {
// // // // // //         return value >= this.rangoInicial
// // // // // //       },
// // // // // //       message: "El rango final debe ser mayor al rango inicial",
// // // // // //     },
// // // // // //   },
// // // // // //   concepto: {
// // // // // //     type: String,
// // // // // //     required: [true, "El concepto es requerido"],
// // // // // //     trim: true,
// // // // // //     maxlength: [255, "El concepto no puede exceder 255 caracteres"],
// // // // // //   },
// // // // // // })

// // // // // // const scaleSchema = new mongoose.Schema(
// // // // // //   {
// // // // // //     nombre: {
// // // // // //       type: String,
// // // // // //       trim: true,
// // // // // //       maxlength: [255, "El nombre no puede exceder 255 caracteres"],
// // // // // //       default: () => `Escala ${new Date().toLocaleDateString()}`,
// // // // // //     },
// // // // // //     descripcion: {
// // // // // //       type: String,
// // // // // //       trim: true,
// // // // // //       maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
// // // // // //       default: "",
// // // // // //     },
// // // // // //     fechaInicial: {
// // // // // //       type: Date,
// // // // // //       required: [true, "La fecha inicial es requerida"],
// // // // // //     },
// // // // // //     fechaFinal: {
// // // // // //       type: Date,
// // // // // //       required: [true, "La fecha final es requerida"],
// // // // // //       validate: {
// // // // // //         validator: function (value) {
// // // // // //           return value >= this.fechaInicial
// // // // // //         },
// // // // // //         message: "La fecha final debe ser posterior a la fecha inicial",
// // // // // //       },
// // // // // //     },
// // // // // //     apruebaPorcentaje: {
// // // // // //       type: Number,
// // // // // //       required: [true, "El porcentaje de aprobación es requerido"],
// // // // // //       min: [0, "El porcentaje debe ser mayor o igual a 0"],
// // // // // //       max: [100, "El porcentaje no puede exceder 100"],
// // // // // //       default: 70,
// // // // // //     },
// // // // // //     rangoInicial: {
// // // // // //       type: Number,
// // // // // //       min: [0, "El rango inicial debe ser mayor o igual a 0"],
// // // // // //       max: [100, "El rango inicial no puede exceder 100"],
// // // // // //       default: 0,
// // // // // //     },
// // // // // //     rangoFinal: {
// // // // // //       type: Number,
// // // // // //       min: [0, "El rango final debe ser mayor o igual a 0"],
// // // // // //       max: [100, "El rango final no puede exceder 100"],
// // // // // //       default: 100,
// // // // // //     },
// // // // // //     valoracion: {
// // // // // //       type: String,
// // // // // //       enum: {
// // // // // //         values: ["Aprueba", "No aprueba"],
// // // // // //         message: "La valoración debe ser Aprueba o No aprueba",
// // // // // //       },
// // // // // //       default: "Aprueba",
// // // // // //     },
// // // // // //     estado: {
// // // // // //       type: String,
// // // // // //       enum: {
// // // // // //         values: ["activo", "inactivo"],
// // // // // //         message: "El estado debe ser activo o inactivo",
// // // // // //       },
// // // // // //       default: "activo",
// // // // // //     },
// // // // // //     metricas: [metricSchema],
// // // // // //     // Hacer creado_por opcional y sin validación estricta
// // // // // //     creado_por: {
// // // // // //       type: String, // Cambiar a String para evitar problemas de ObjectId
// // // // // //       required: false,
// // // // // //       default: "sistema",
// // // // // //     },
// // // // // //   },
// // // // // //   {
// // // // // //     timestamps: {
// // // // // //       createdAt: "fecha_creacion",
// // // // // //       updatedAt: "fecha_actualizacion",
// // // // // //     },
// // // // // //   },
// // // // // // )

// // // // // // // Índices para mejorar rendimiento
// // // // // // scaleSchema.index({ fechaInicial: 1, fechaFinal: 1 })
// // // // // // scaleSchema.index({ estado: 1 })
// // // // // // scaleSchema.index({ fecha_creacion: -1 })

// // // // // // module.exports = mongoose.model("Scale", scaleSchema)
// // // // // const mongoose = require("mongoose")

// // // // // const metricSchema = new mongoose.Schema({
// // // // //   id: {
// // // // //     type: Number,
// // // // //     required: false,
// // // // //   },
// // // // //   rangoInicial: {
// // // // //     type: Number,
// // // // //     required: [true, "El rango inicial es requerido"],
// // // // //     min: [0, "El rango inicial debe ser mayor o igual a 0"],
// // // // //     max: [100, "El rango inicial no puede exceder 100"],
// // // // //   },
// // // // //   rangoFinal: {
// // // // //     type: Number,
// // // // //     required: [true, "El rango final es requerido"],
// // // // //     min: [0, "El rango final debe ser mayor o igual a 0"],
// // // // //     max: [100, "El rango final no puede exceder 100"],
// // // // //     validate: {
// // // // //       validator: function (value) {
// // // // //         return value >= this.rangoInicial
// // // // //       },
// // // // //       message: "El rango final debe ser mayor al rango inicial",
// // // // //     },
// // // // //   },
// // // // //   concepto: {
// // // // //     type: String,
// // // // //     required: [true, "El concepto es requerido"],
// // // // //     trim: true,
// // // // //     maxlength: [255, "El concepto no puede exceder 255 caracteres"],
// // // // //   },
// // // // // })

// // // // // const scaleSchema = new mongoose.Schema(
// // // // //   {
// // // // //     nombre: {
// // // // //       type: String,
// // // // //       trim: true,
// // // // //       maxlength: [255, "El nombre no puede exceder 255 caracteres"],
// // // // //       default: () => `Escala ${new Date().toLocaleDateString()}`,
// // // // //     },
// // // // //     descripcion: {
// // // // //       type: String,
// // // // //       trim: true,
// // // // //       maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
// // // // //       default: "",
// // // // //     },
// // // // //     fechaInicial: {
// // // // //       type: Date,
// // // // //       required: [true, "La fecha inicial es requerida"],
// // // // //     },
// // // // //     fechaFinal: {
// // // // //       type: Date,
// // // // //       required: [true, "La fecha final es requerida"],
// // // // //       validate: {
// // // // //         validator: function (value) {
// // // // //           // Convertir ambas fechas a solo fecha (sin hora) para comparación
// // // // //           const fechaFinal = new Date(value)
// // // // //           const fechaInicial = new Date(this.fechaInicial)

// // // // //           // Resetear horas para comparar solo fechas
// // // // //           fechaFinal.setHours(0, 0, 0, 0)
// // // // //           fechaInicial.setHours(0, 0, 0, 0)

// // // // //           console.log("Validando fechas:")
// // // // //           console.log("Fecha inicial:", fechaInicial)
// // // // //           console.log("Fecha final:", fechaFinal)
// // // // //           console.log("Es válida:", fechaFinal >= fechaInicial)

// // // // //           return fechaFinal >= fechaInicial
// // // // //         },
// // // // //         message: "La fecha final debe ser igual o posterior a la fecha inicial",
// // // // //       },
// // // // //     },
// // // // //     apruebaPorcentaje: {
// // // // //       type: Number,
// // // // //       required: [true, "El porcentaje de aprobación es requerido"],
// // // // //       min: [0, "El porcentaje debe ser mayor o igual a 0"],
// // // // //       max: [100, "El porcentaje no puede exceder 100"],
// // // // //       default: 70,
// // // // //     },
// // // // //     rangoInicial: {
// // // // //       type: Number,
// // // // //       min: [0, "El rango inicial debe ser mayor o igual a 0"],
// // // // //       max: [100, "El rango inicial no puede exceder 100"],
// // // // //       default: 0,
// // // // //     },
// // // // //     rangoFinal: {
// // // // //       type: Number,
// // // // //       min: [0, "El rango final debe ser mayor o igual a 0"],
// // // // //       max: [100, "El rango final no puede exceder 100"],
// // // // //       default: 100,
// // // // //     },
// // // // //     valoracion: {
// // // // //       type: String,
// // // // //       enum: {
// // // // //         values: ["Aprueba", "No aprueba"],
// // // // //         message: "La valoración debe ser Aprueba o No aprueba",
// // // // //       },
// // // // //       default: "Aprueba",
// // // // //     },
// // // // //     estado: {
// // // // //       type: String,
// // // // //       enum: {
// // // // //         values: ["activo", "inactivo"],
// // // // //         message: "El estado debe ser activo o inactivo",
// // // // //       },
// // // // //       default: "activo",
// // // // //     },
// // // // //     metricas: [metricSchema],
// // // // //     creado_por: {
// // // // //       type: String,
// // // // //       required: false,
// // // // //       default: "sistema",
// // // // //     },
// // // // //   },
// // // // //   {
// // // // //     timestamps: {
// // // // //       createdAt: "fecha_creacion",
// // // // //       updatedAt: "fecha_actualizacion",
// // // // //     },
// // // // //   },
// // // // // )

// // // // // // Índices para mejorar rendimiento
// // // // // scaleSchema.index({ fechaInicial: 1, fechaFinal: 1 })
// // // // // scaleSchema.index({ estado: 1 })
// // // // // scaleSchema.index({ fecha_creacion: -1 })

// // // // // module.exports = mongoose.model("Scale", scaleSchema)
// // // // const mongoose = require("mongoose")

// // // // const metricSchema = new mongoose.Schema({
// // // //   id: {
// // // //     type: Number,
// // // //     required: false,
// // // //   },
// // // //   rangoInicial: {
// // // //     type: Number,
// // // //     required: [true, "El rango inicial es requerido"],
// // // //     min: [0, "El rango inicial debe ser mayor o igual a 0"],
// // // //     max: [100, "El rango inicial no puede exceder 100"],
// // // //   },
// // // //   rangoFinal: {
// // // //     type: Number,
// // // //     required: [true, "El rango final es requerido"],
// // // //     min: [0, "El rango final debe ser mayor o igual a 0"],
// // // //     max: [100, "El rango final no puede exceder 100"],
// // // //     validate: {
// // // //       validator: function (value) {
// // // //         return value >= this.rangoInicial
// // // //       },
// // // //       message: "El rango final debe ser mayor al rango inicial",
// // // //     },
// // // //   },
// // // //   concepto: {
// // // //     type: String,
// // // //     required: [true, "El concepto es requerido"],
// // // //     trim: true,
// // // //     maxlength: [255, "El concepto no puede exceder 255 caracteres"],
// // // //   },
// // // // })

// // // // const scaleSchema = new mongoose.Schema(
// // // //   {
// // // //     nombre: {
// // // //       type: String,
// // // //       trim: true,
// // // //       maxlength: [255, "El nombre no puede exceder 255 caracteres"],
// // // //       default: () => `Escala ${new Date().toLocaleDateString()}`,
// // // //     },
// // // //     descripcion: {
// // // //       type: String,
// // // //       trim: true,
// // // //       maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
// // // //       default: "",
// // // //     },
// // // //     fechaInicial: {
// // // //       type: Date,
// // // //       required: [true, "La fecha inicial es requerida"],
// // // //     },
// // // //     fechaFinal: {
// // // //       type: Date,
// // // //       required: [true, "La fecha final es requerida"],
// // // //       validate: {
// // // //         validator: function (value) {
// // // //           // Convertir ambas fechas a solo fecha (sin hora) para comparación
// // // //           const fechaFinal = new Date(value)
// // // //           const fechaInicial = new Date(this.fechaInicial)

// // // //           // Resetear horas para comparar solo fechas
// // // //           fechaFinal.setHours(0, 0, 0, 0)
// // // //           fechaInicial.setHours(0, 0, 0, 0)

// // // //           console.log("Validando fechas:")
// // // //           console.log("Fecha inicial:", fechaInicial)
// // // //           console.log("Fecha final:", fechaFinal)
// // // //           console.log("Es válida:", fechaFinal >= fechaInicial)

// // // //           return fechaFinal >= fechaInicial
// // // //         },
// // // //         message: "La fecha final debe ser igual o posterior a la fecha inicial",
// // // //       },
// // // //     },
// // // //     apruebaPorcentaje: {
// // // //       type: Number,
// // // //       required: [true, "El porcentaje de aprobación es requerido"],
// // // //       min: [0, "El porcentaje debe ser mayor o igual a 0"],
// // // //       max: [100, "El porcentaje no puede exceder 100"],
// // // //       default: 70,
// // // //     },
// // // //     rangoInicial: {
// // // //       type: Number,
// // // //       min: [0, "El rango inicial debe ser mayor o igual a 0"],
// // // //       max: [100, "El rango inicial no puede exceder 100"],
// // // //       default: 0,
// // // //     },
// // // //     rangoFinal: {
// // // //       type: Number,
// // // //       min: [0, "El rango final debe ser mayor o igual a 0"],
// // // //       max: [100, "El rango final no puede exceder 100"],
// // // //       default: 100,
// // // //     },
// // // //     valoracion: {
// // // //       type: String,
// // // //       enum: {
// // // //         values: ["Aprueba", "No aprueba"],
// // // //         message: "La valoración debe ser Aprueba o No aprueba",
// // // //       },
// // // //       default: "Aprueba",
// // // //     },
// // // //     estado: {
// // // //       type: String,
// // // //       enum: {
// // // //         values: ["activo", "inactivo"],
// // // //         message: "El estado debe ser activo o inactivo",
// // // //       },
// // // //       default: "activo",
// // // //     },
// // // //     metricas: [metricSchema],
// // // //     creado_por: {
// // // //       type: String,
// // // //       required: false,
// // // //       default: "sistema",
// // // //     },
// // // //   },
// // // //   {
// // // //     timestamps: {
// // // //       createdAt: "fecha_creacion",
// // // //       updatedAt: "fecha_actualizacion",
// // // //     },
// // // //   },
// // // // )

// // // // // Índices para mejorar rendimiento
// // // // scaleSchema.index({ fechaInicial: 1, fechaFinal: 1 })
// // // // scaleSchema.index({ estado: 1 })
// // // // scaleSchema.index({ fecha_creacion: -1 })

// // // // module.exports = mongoose.model("Scale", scaleSchema)
// // // // src/models/scale.js
// // // import { DataTypes } from "sequelize";
// // // import sequelize from "../config/database.js";

// // // const Scale = sequelize.define(
// // //   "Scale",
// // //   {
// // //     id: {
// // //       type: DataTypes.INTEGER,
// // //       primaryKey: true,
// // //       autoIncrement: true,
// // //     },
// // //     fechaInicial: {
// // //       type: DataTypes.DATEONLY,
// // //       allowNull: false,
// // //       validate: {
// // //         notEmpty: { msg: "La fecha inicial es requerida" },
// // //         isDate: { msg: "La fecha inicial debe ser una fecha válida" },
// // //       },
// // //     },
// // //     fechaFinal: {
// // //       type: DataTypes.DATEONLY,
// // //       allowNull: false,
// // //       validate: {
// // //         notEmpty: { msg: "La fecha final es requerida" },
// // //         isDate: { msg: "La fecha final debe ser una fecha válida" },
// // //         isAfterStartDate(value) {
// // //           if (value <= this.fechaInicial) {
// // //             throw new Error("La fecha final debe ser posterior a la fecha inicial");
// // //           }
// // //         },
// // //       },
// // //     },
// // //     rangoInicial: {
// // //       type: DataTypes.INTEGER,
// // //       allowNull: false,
// // //       validate: {
// // //         min: { args: [0], msg: "El rango inicial debe ser mayor o igual a 0" },
// // //         max: { args: [100], msg: "El rango inicial debe ser menor o igual a 100" },
// // //       },
// // //     },
// // //     rangoFinal: {
// // //       type: DataTypes.INTEGER,
// // //       allowNull: false,
// // //       validate: {
// // //         min: { args: [0], msg: "El rango final debe ser mayor o igual a 0" },
// // //         max: { args: [100], msg: "El rango final debe ser menor o igual a 100" },
// // //         isGreaterThanInitial(value) {
// // //           if (value <= this.rangoInicial) {
// // //             throw new Error("El rango final debe ser mayor al rango inicial");
// // //           }
// // //         },
// // //       },
// // //     },
// // //     valoracion: {
// // //       type: DataTypes.ENUM("Aprueba", "No aprueba"),
// // //       allowNull: false,
// // //       defaultValue: "Aprueba",
// // //       validate: {
// // //         isIn: {
// // //           args: [["Aprueba", "No aprueba"]],
// // //           msg: 'La valoración debe ser "Aprueba" o "No aprueba"',
// // //         },
// // //       },
// // //     },
// // //     descripcion: {
// // //       type: DataTypes.TEXT,
// // //       allowNull: true,
// // //       validate: {
// // //         len: {
// // //           args: [0, 1000],
// // //           msg: "La descripción no puede exceder los 1000 caracteres",
// // //         },
// // //       },
// // //     },
// // //     apruebaPorcentaje: {
// // //       type: DataTypes.INTEGER,
// // //       allowNull: false,
// // //       defaultValue: 70,
// // //       validate: {
// // //         min: { args: [0], msg: "El porcentaje de aprobación debe ser mayor o igual a 0" },
// // //         max: { args: [100], msg: "El porcentaje de aprobación debe ser menor o igual a 100" },
// // //       },
// // //     },
// // //     metricas: {
// // //       type: DataTypes.JSON,
// // //       allowNull: true,
// // //       defaultValue: [],
// // //       validate: {
// // //         isValidMetricas(value) {
// // //           if (value && Array.isArray(value)) {
// // //             for (const metrica of value) {
// // //               if (!metrica.rangoInicial && metrica.rangoInicial !== 0) {
// // //                 throw new Error("Cada métrica debe tener un rango inicial");
// // //               }
// // //               if (!metrica.rangoFinal && metrica.rangoFinal !== 0) {
// // //                 throw new Error("Cada métrica debe tener un rango final");
// // //               }
// // //               if (!metrica.concepto) {
// // //                 throw new Error("Cada métrica debe tener un concepto");
// // //               }
// // //               if (metrica.rangoInicial < 0 || metrica.rangoInicial > 100) {
// // //                 throw new Error("El rango inicial de la métrica debe estar entre 0 y 100");
// // //               }
// // //               if (metrica.rangoFinal < 0 || metrica.rangoFinal > 100) {
// // //                 throw new Error("El rango final de la métrica debe estar entre 0 y 100");
// // //               }
// // //               if (metrica.rangoFinal <= metrica.rangoInicial) {
// // //                 throw new Error("El rango final debe ser mayor al rango inicial en cada métrica");
// // //               }
// // //             }
// // //           }
// // //         },
// // //       },
// // //     },
// // //     estado: {
// // //       type: DataTypes.ENUM("activo", "inactivo"),
// // //       allowNull: false,
// // //       defaultValue: "activo",
// // //     },
// // //   },
// // //   {
// // //     tableName: "scales",
// // //     timestamps: true,
// // //     hooks: {
// // //       beforeValidate: (scale) => {
// // //         if (typeof scale.fechaInicial === "string") {
// // //           scale.fechaInicial = new Date(scale.fechaInicial);
// // //         }
// // //         if (typeof scale.fechaFinal === "string") {
// // //           scale.fechaFinal = new Date(scale.fechaFinal);
// // //         }
// // //       },
// // //     },
// // //   }
// // // );

// // // export default Scale;
// // import mongoose from "mongoose"

// // const metricaSchema = new mongoose.Schema(
// //   {
// //     rangoInicial: {
// //       type: Number,
// //       required: [false, "El rango inicial es requerido"],
// //       min: [0, "El rango inicial debe ser mayor o igual a 0"],
// //       max: [100, "El rango inicial debe ser menor o igual a 100"],
// //     },
// //     rangoFinal: {
// //       type: Number,
// //       required: [false, "El rango final es requerido"],
// //       min: [0, "El rango final debe ser mayor o igual a 0"],
// //       max: [100, "El rango final debe ser menor o igual a 100"],
// //       validate: {
// //         validator: function (value) {
// //           return value > this.rangoInicial
// //         },
// //         message: "El rango final debe ser mayor al rango inicial",
// //       },
// //     },
// //     concepto: {
// //       type: String,
// //       required: [true, "El concepto es requerido"],
// //       trim: true,
// //       maxlength: [100, "El concepto no puede exceder los 100 caracteres"],
// //     },
// //     descripcion: {
// //       type: String,
// //       trim: true,
// //       maxlength: [500, "La descripción no puede exceder los 500 caracteres"],
// //     },
// //   },
// //   { _id: false },
// // )

// // const scaleSchema = new mongoose.Schema(
// //   {
// //     fechaInicial: {
// //       type: Date,
// //       required: [true, "La fecha inicial es requerida"],
// //       validate: {
// //         validator: (value) => value instanceof Date && !isNaN(value),
// //         message: "La fecha inicial debe ser una fecha válida",
// //       },
// //     },
// //     fechaFinal: {
// //       type: Date,
// //       required: [true, "La fecha final es requerida"],
// //       validate: {
// //         validator: function (value) {
// //           return value instanceof Date && !isNaN(value) && value > this.fechaInicial
// //         },
// //         message: "La fecha final debe ser posterior a la fecha inicial",
// //       },
// //     },
// //     rangoInicial: {
// //       type: Number,
// //       required: [true, "El rango inicial es requerido"],
// //       min: [0, "El rango inicial debe ser mayor o igual a 0"],
// //       max: [100, "El rango inicial debe ser menor o igual a 100"],
// //     },
// //     rangoFinal: {
// //       type: Number,
// //       required: [true, "El rango final es requerido"],
// //       min: [0, "El rango final debe ser mayor o igual a 0"],
// //       max: [100, "El rango final debe ser menor o igual a 100"],
// //       validate: {
// //         validator: function (value) {
// //           return value > this.rangoInicial
// //         },
// //         message: "El rango final debe ser mayor al rango inicial",
// //       },
// //     },
// //     valoracion: {
// //       type: String,
// //       required: [true, "La valoración es requerida"],
// //       enum: {
// //         values: ["Aprueba", "No aprueba"],
// //         message: 'La valoración debe ser "Aprueba" o "No aprueba"',
// //       },
// //       default: "Aprueba",
// //     },
// //     descripcion: {
// //       type: String,
// //       trim: true,
// //       maxlength: [1000, "La descripción no puede exceder los 1000 caracteres"],
// //     },
// //     apruebaPorcentaje: {
// //       type: Number,
// //       required: [true, "El porcentaje de aprobación es requerido"],
// //       min: [0, "El porcentaje debe ser mayor o igual a 0"],
// //       max: [100, "El porcentaje debe ser menor o igual a 100"],
// //       default: 70,
// //     },
// //     metricas: {
// //       type: [metricaSchema],
// //       default: [],
// //       validate: {
// //         validator: (metricas) => {
// //           if (!Array.isArray(metricas)) return false

// //           // Validar que no haya solapamiento de rangos
// //           for (let i = 0; i < metricas.length; i++) {
// //             for (let j = i + 1; j < metricas.length; j++) {
// //               const metrica1 = metricas[i]
// //               const metrica2 = metricas[j]

// //               // Verificar solapamiento
// //               if (
// //                 (metrica1.rangoInicial <= metrica2.rangoFinal && metrica1.rangoFinal >= metrica2.rangoInicial) ||
// //                 (metrica2.rangoInicial <= metrica1.rangoFinal && metrica2.rangoFinal >= metrica1.rangoInicial)
// //               ) {
// //                 return false
// //               }
// //             }
// //           }
// //           return true
// //         },
// //         message: "Las métricas no pueden tener rangos que se solapen",
// //       },
// //     },
// //     estado: {
// //       type: String,
// //       enum: {
// //         values: ["activo", "inactivo"],
// //         message: 'El estado debe ser "activo" o "inactivo"',
// //       },
// //       default: "activo",
// //     },
// //   },
// //   {
// //     timestamps: true,
// //     versionKey: false,
// //   },
// // )

// // // Índices para optimizar consultas
// // scaleSchema.index({ fechaInicial: 1, fechaFinal: 1 })
// // scaleSchema.index({ estado: 1 })
// // scaleSchema.index({ valoracion: 1 })

// // // Middleware para validar solapamiento de fechas con otras escalas
// // scaleSchema.pre("save", async function (next) {
// //   if (this.isNew || this.isModified("fechaInicial") || this.isModified("fechaFinal")) {
// //     const overlappingScale = await this.constructor.findOne({
// //       _id: { $ne: this._id },
// //       estado: "activo",
// //       $or: [
// //         {
// //           fechaInicial: { $lte: this.fechaFinal },
// //           fechaFinal: { $gte: this.fechaInicial },
// //         },
// //       ],
// //     })

// //     if (overlappingScale) {
// //       const error = new Error("Ya existe una escala activa en el rango de fechas especificado")
// //       error.name = "ValidationError"
// //       return next(error)
// //     }
// //   }
// //   next()
// // })

// // // Método para obtener escalas activas
// // scaleSchema.statics.findActive = function () {
// //   return this.find({ estado: "activo" }).sort({ fechaInicial: -1 })
// // }

// // // Método para obtener escala vigente en una fecha
// // scaleSchema.statics.findByDate = function (date) {
// //   return this.findOne({
// //     estado: "activo",
// //     fechaInicial: { $lte: date },
// //     fechaFinal: { $gte: date },
// //   })
// // }

// // // Método para evaluar una calificación
// // scaleSchema.methods.evaluateScore = function (score) {
// //   if (score < this.rangoInicial || score > this.rangoFinal) {
// //     return {
// //       aprueba: false,
// //       concepto: "Fuera de rango",
// //       mensaje: `La calificación ${score} está fuera del rango válido (${this.rangoInicial}-${this.rangoFinal})`,
// //     }
// //   }

// //   // Buscar en métricas específicas
// //   for (const metrica of this.metricas) {
// //     if (score >= metrica.rangoInicial && score <= metrica.rangoFinal) {
// //       return {
// //         aprueba: score >= this.apruebaPorcentaje,
// //         concepto: metrica.concepto,
// //         descripcion: metrica.descripcion,
// //         valoracion: score >= this.apruebaPorcentaje ? "Aprueba" : "No aprueba",
// //       }
// //     }
// //   }

// //   // Evaluación general si no hay métricas específicas
// //   return {
// //     aprueba: score >= this.apruebaPorcentaje,
// //     concepto: score >= this.apruebaPorcentaje ? "Aprobado" : "No aprobado",
// //     valoracion: score >= this.apruebaPorcentaje ? "Aprueba" : "No aprueba",
// //   }
// // }

// // // Método para obtener estadísticas
// // scaleSchema.methods.getStats = function () {
// //   return {
// //     rangoTotal: this.rangoFinal - this.rangoInicial,
// //     porcentajeAprobacion: this.apruebaPorcentaje,
// //     totalMetricas: this.metricas.length,
// //     vigencia: {
// //       inicio: this.fechaInicial,
// //       fin: this.fechaFinal,
// //       diasVigencia: Math.ceil((this.fechaFinal - this.fechaInicial) / (1000 * 60 * 60 * 24)),
// //     },
// //   }
// // }

// // const Scale = mongoose.model("Scale", scaleSchema)

// // export default Scale
// import mongoose from "mongoose"

// const metricaSchema = new mongoose.Schema(
//   {
//     rangoInicial: {
//       type: Number,
//       required: [true, "El rango inicial de la métrica es requerido"],
//       min: [0, "El rango inicial debe ser mayor o igual a 0"],
//       max: [100, "El rango inicial debe ser menor o igual a 100"],
//     },
//     rangoFinal: {
//       type: Number,
//       required: [true, "El rango final de la métrica es requerido"],
//       min: [0, "El rango final debe ser mayor o igual a 0"],
//       max: [100, "El rango final debe ser menor o igual a 100"],
//       validate: {
//         validator: function (value) {
//           return value > this.rangoInicial
//         },
//         message: "El rango final debe ser mayor al rango inicial",
//       },
//     },
//     concepto: {
//       type: String,
//       required: [true, "El concepto es requerido"],
//       trim: true,
//       maxlength: [100, "El concepto no puede exceder los 100 caracteres"],
//     },
//     descripcion: {
//       type: String,
//       trim: true,
//       maxlength: [500, "La descripción no puede exceder los 500 caracteres"],
//     },
//   },
//   { _id: false },
// )

// const scaleSchema = new mongoose.Schema(
//   {
//     fechaInicial: {
//       type: Date,
//       required: [true, "La fecha inicial es requerida"],
//       validate: {
//         validator: (value) => value instanceof Date && !isNaN(value),
//         message: "La fecha inicial debe ser una fecha válida",
//       },
//     },
//     fechaFinal: {
//       type: Date,
//       required: [true, "La fecha final es requerida"],
//       validate: {
//         validator: function (value) {
//           return value instanceof Date && !isNaN(value) && value >= this.fechaInicial
//         },
//         message: "La fecha final debe ser posterior o igual a la fecha inicial",
//       },
//     },
//     // Estos campos NO son requeridos para la escala principal
//     rangoInicial: {
//       type: Number,
//       min: [0, "El rango inicial debe ser mayor o igual a 0"],
//       max: [100, "El rango inicial debe ser menor o igual a 100"],
//       default: 0,
//     },
//     rangoFinal: {
//       type: Number,
//       min: [0, "El rango final debe ser mayor o igual a 0"],
//       max: [100, "El rango final debe ser menor o igual a 100"],
//       default: 100,
//     },
//     valoracion: {
//       type: String,
//       enum: {
//         values: ["Aprueba", "No aprueba"],
//         message: 'La valoración debe ser "Aprueba" o "No aprueba"',
//       },
//       default: "Aprueba",
//     },
//     descripcion: {
//       type: String,
//       trim: true,
//       maxlength: [1000, "La descripción no puede exceder los 1000 caracteres"],
//     },
//     apruebaPorcentaje: {
//       type: Number,
//       required: [true, "El porcentaje de aprobación es requerido"],
//       min: [0, "El porcentaje debe ser mayor o igual a 0"],
//       max: [100, "El porcentaje debe ser menor o igual a 100"],
//       default: 70,
//     },
//     // Las métricas SÍ usan rangoInicial y rangoFinal
//     metricas: {
//       type: [metricaSchema],
//       default: [],
//       validate: {
//         validator: (metricas) => {
//           if (!Array.isArray(metricas) || metricas.length === 0) return true

//           // Validar que no haya solapamiento de rangos entre métricas
//           for (let i = 0; i < metricas.length; i++) {
//             for (let j = i + 1; j < metricas.length; j++) {
//               const metrica1 = metricas[i]
//               const metrica2 = metricas[j]

//               // Verificar solapamiento
//               if (metrica1.rangoInicial < metrica2.rangoFinal && metrica1.rangoFinal > metrica2.rangoInicial) {
//                 return false
//               }
//             }
//           }
//           return true
//         },
//         message: "Las métricas no pueden tener rangos que se solapen",
//       },
//     },
//     estado: {
//       type: String,
//       enum: {
//         values: ["activo", "inactivo"],
//         message: 'El estado debe ser "activo" o "inactivo"',
//       },
//       default: "activo",
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   },
// )

// // Índices para optimizar consultas
// scaleSchema.index({ fechaInicial: 1, fechaFinal: 1 })
// scaleSchema.index({ estado: 1 })
// scaleSchema.index({ valoracion: 1 })

// // Middleware para validar solapamiento de fechas con otras escalas
// scaleSchema.pre("save", async function (next) {
//   if (this.isNew || this.isModified("fechaInicial") || this.isModified("fechaFinal")) {
//     const overlappingScale = await this.constructor.findOne({
//       _id: { $ne: this._id },
//       estado: "activo",
//       $or: [
//         {
//           fechaInicial: { $lte: this.fechaFinal },
//           fechaFinal: { $gte: this.fechaInicial },
//         },
//       ],
//     })

//     if (overlappingScale) {
//       const error = new Error("Ya existe una escala activa en el rango de fechas especificado")
//       error.name = "ValidationError"
//       return next(error)
//     }
//   }
//   next()
// })

// // Método estático para encontrar escalas activas
// scaleSchema.statics.findActive = function () {
//   return this.find({ estado: "activo" }).sort({ fechaInicial: -1 })
// }

// // Método estático para encontrar escala por fecha
// scaleSchema.statics.findByDate = function (date) {
//   return this.findOne({
//     estado: "activo",
//     fechaInicial: { $lte: date },
//     fechaFinal: { $gte: date },
//   })
// }

// // Método para evaluar una calificación usando las métricas
// scaleSchema.methods.evaluateScore = function (score) {
//   // Buscar en métricas específicas
//   for (const metrica of this.metricas) {
//     if (score >= metrica.rangoInicial && score <= metrica.rangoFinal) {
//       return {
//         aprueba: score >= this.apruebaPorcentaje,
//         concepto: metrica.concepto,
//         descripcion: metrica.descripcion,
//         valoracion: score >= this.apruebaPorcentaje ? "Aprueba" : "No aprueba",
//         metrica: {
//           rangoInicial: metrica.rangoInicial,
//           rangoFinal: metrica.rangoFinal,
//           concepto: metrica.concepto,
//         },
//       }
//     }
//   }

//   // Si no hay métricas o no coincide con ninguna
//   return {
//     aprueba: score >= this.apruebaPorcentaje,
//     concepto: score >= this.apruebaPorcentaje ? "Aprobado" : "No aprobado",
//     valoracion: score >= this.apruebaPorcentaje ? "Aprueba" : "No aprueba",
//     mensaje: "Evaluación general sin métrica específica",
//   }
// }

// // Método para obtener estadísticas
// scaleSchema.methods.getStats = function () {
//   return {
//     porcentajeAprobacion: this.apruebaPorcentaje,
//     totalMetricas: this.metricas.length,
//     vigencia: {
//       inicio: this.fechaInicial,
//       fin: this.fechaFinal,
//       diasVigencia: Math.ceil((this.fechaFinal - this.fechaInicial) / (1000 * 60 * 60 * 24)),
//     },
//     rangosMetricas: this.metricas.map((m) => ({
//       concepto: m.concepto,
//       rango: `${m.rangoInicial}-${m.rangoFinal}%`,
//     })),
//   }
// }

// const Scale = mongoose.model("Scale", scaleSchema)

// export default Scale
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
