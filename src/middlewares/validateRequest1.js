import Joi from "joi"
import { validationResult } from "express-validator"

// Validation schema for creating/updating evaluations
const evaluationSchema = Joi.object({
  nombre: Joi.string().required().messages({
    "string.empty": "El nombre de la evaluación es obligatorio",
    "any.required": "El nombre de la evaluación es obligatorio",
  }),
  tematica: Joi.string().required().messages({
    "string.empty": "La temática es obligatoria",
    "any.required": "La temática es obligatoria",
  }),
  tipoEvaluacion: Joi.string().valid("Examen", "Actividad").required().messages({
    "string.empty": "El tipo de evaluación es obligatorio",
    "any.required": "El tipo de evaluación es obligatorio",
    "any.only": "El tipo de evaluación debe ser Examen o Actividad",
  }),
  estado: Joi.string().valid("Activo", "Inactivo").default("Activo"),
  descripcion: Joi.string().allow("", null),
  preguntas: Joi.array().items(
    Joi.object({
      tipo: Joi.string().valid("seleccion", "verdaderoFalso", "imagen", "audio", "completar").required(),
      texto: Joi.string().when("tipo", {
        is: Joi.string().valid("seleccion", "verdaderoFalso", "imagen", "audio"),
        then: Joi.required(),
      }),
      completarTexto: Joi.string().when("tipo", {
        is: "completar",
        then: Joi.required(),
      }),
      palabrasCompletar: Joi.array().items(Joi.string()).when("tipo", {
        is: "completar",
        then: Joi.required(),
      }),
      opcionesRelleno: Joi.array().items(Joi.string()).when("tipo", {
        is: "completar",
        then: Joi.required(),
      }),
      opciones: Joi.array()
        .items(Joi.string())
        .when("tipo", {
          is: Joi.string().valid("seleccion", "verdaderoFalso"),
          then: Joi.required(),
        }),
      respuestaCorrecta: Joi.number().when("tipo", {
        is: Joi.string().valid("seleccion", "verdaderoFalso"),
        then: Joi.required(),
      }),
      puntaje: Joi.number().required(),
      imagen: Joi.string().when("tipo", {
        is: "imagen",
        then: Joi.required(),
      }),
      audio: Joi.string().when("tipo", {
        is: "audio",
        then: Joi.required(),
      }),
    }),
  ),
})

// Middleware for express-validator
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array().map((error) => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value,
      })),
    })
  }

  next()
}

// Legacy validation for evaluations (keeping for backward compatibility)
export const validateEvaluation = (req, res, next) => {
  // For POST requests, validate the entire body
  // For PUT requests, validate only the fields that are present
  const options = req.method === "PUT" ? { allowUnknown: true, stripUnknown: false } : {}

  // Parse preguntas if it's a string
  if (req.body.preguntas && typeof req.body.preguntas === "string") {
    try {
      req.body.preguntas = JSON.parse(req.body.preguntas)
    } catch (error) {
      return res.status(400).json({ message: "El formato de las preguntas es inválido" })
    }
  }

  const { error } = evaluationSchema.validate(req.body, options)

  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  next()
}
