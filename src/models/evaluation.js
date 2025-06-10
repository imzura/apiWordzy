import mongoose, { model } from "mongoose"

const questionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["seleccion", "verdaderoFalso", "imagen", "audio", "completar"],
    required: true,
  },
  texto: {
    type: String,
    default: "",
  },
  completarTexto: {
    type: String,
    default: "",
  },
  palabrasCompletar: {
    type: [String],
    default: [],
  },
  opcionesRelleno: {
    type: [String],
    default: [],
  },
  opciones: {
    type: [String],
    default: [],
  },
  respuestaCorrecta: {
    type: Number,
    default: 0,
  },
  puntaje: {
    type: Number,
    required: true,
  },
  imagen: {
    type: String,
    default: null,
  },
  audio: {
    type: String,
    default: null,
  },
})

const evaluationSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  tematica: {
    type: String,
    required: true,
  },
  tipoEvaluacion: {
    type: String,
    enum: ["Examen", "Actividad"],
    required: true,
  },
  estado: {
    type: String,
    enum: ["Activo", "Inactivo"],
    default: "Activo",
  },
  descripcion: String,
  material: String,
  preguntas: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Middleware para actualizar el timestamp updatedAt antes de cada actualización
evaluationSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: new Date() })
})

export default mongoose.models.Evaluation || model('Evaluation', evaluationSchema, 'evaluations');