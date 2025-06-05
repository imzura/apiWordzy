// Middleware para validar datos de instructores
import Joi from "joi"

// Esquema de validación para estudiantes dentro de fichas
const estudianteSchema = Joi.object({
  nombre: Joi.string().trim(),
  apellido: Joi.string().trim(),
  documento: Joi.string().trim(),
  tipoDocumento: Joi.string().valid("CC", "TI", "PPT", "PEP"),
  estado: Joi.string().valid("En formación", "Condicionado", "Retirado", "Graduado").default("En formación"),
})

// Esquema de validación para fichas
const fichaSchema = Joi.object({
  numero: Joi.string().required().messages({
    "string.empty": "El número de ficha es obligatorio",
    "any.required": "El número de ficha es obligatorio",
  }),
  nivel: Joi.number().integer().min(1).max(6).required().messages({
    "number.min": "El nivel debe ser entre 1 y 6",
    "number.max": "El nivel debe ser entre 1 y 6",
    "any.required": "El nivel es obligatorio",
  }),
  programa: Joi.string().required().messages({
    "string.empty": "El programa es obligatorio",
    "any.required": "El programa es obligatorio",
  }),
  fechaInicio: Joi.string().required().messages({
    "string.empty": "La fecha de inicio es obligatoria",
    "any.required": "La fecha de inicio es obligatoria",
  }),
  fechaFin: Joi.string().required().messages({
    "string.empty": "La fecha de fin es obligatoria",
    "any.required": "La fecha de fin es obligatoria",
  }),
  estudiantes: Joi.array().items(estudianteSchema).default([]),
})

// Esquema de validación para crear/actualizar instructores
const instructorSchema = Joi.object({
  nombre: Joi.string().required().trim().messages({
    "string.empty": "El nombre es obligatorio",
    "any.required": "El nombre es obligatorio",
  }),
  apellido: Joi.string().required().trim().messages({
    "string.empty": "El apellido es obligatorio",
    "any.required": "El apellido es obligatorio",
  }),
  documento: Joi.string().required().trim().messages({
    "string.empty": "El documento es obligatorio",
    "any.required": "El documento es obligatorio",
  }),
  tipoDocumento: Joi.string().valid("CC", "TI", "PPT", "PEP").required().messages({
    "string.empty": "El tipo de documento es obligatorio",
    "any.required": "El tipo de documento es obligatorio",
    "any.only": "El tipo de documento debe ser CC, TI, PPT o PEP",
  }),
  estado: Joi.string().valid("Activo", "Inactivo").default("Activo").messages({
    "any.only": "El estado debe ser Activo o Inactivo",
  }),
  telefono: Joi.string().required().trim().messages({
    "string.empty": "El teléfono es obligatorio",
    "any.required": "El teléfono es obligatorio",
  }),
  correo: Joi.string().email().required().lowercase().trim().messages({
    "string.empty": "El correo es obligatorio",
    "any.required": "El correo es obligatorio",
    "string.email": "El correo debe tener un formato válido",
  }),
  fichas: Joi.array().items(fichaSchema).default([]),
})

export const validateInstructor = (req, res, next) => {
  // Para PUT requests, permitir campos opcionales
  const options = req.method === "PUT" ? { allowUnknown: true, stripUnknown: false } : {}

  const { error } = instructorSchema.validate(req.body, options)

  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  next()
}

export const validateFicha = (req, res, next) => {
  const { error } = fichaSchema.validate(req.body)

  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  next()
}
