import { body } from "express-validator"

export const validateSupportMaterial = [
  body("titulo")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 1, max: 255 })
    .withMessage("El título debe tener entre 1 y 255 caracteres"),

  body("tema")
    .notEmpty()
    .withMessage("El tema es obligatorio")
    .isLength({ min: 1, max: 100 })
    .withMessage("El tema debe tener entre 1 y 100 caracteres"),

  body("contenido")
    .notEmpty()
    .withMessage("El contenido es obligatorio")
    .isLength({ min: 1 })
    .withMessage("El contenido no puede estar vacío"),

  body("tipo")
    .optional()
    .isIn(["documento", "video", "audio", "imagen", "enlace"])
    .withMessage("El tipo debe ser uno de: documento, video, audio, imagen, enlace"),

  body("nivel")
    .optional()
    .isIn(["principiante", "intermedio", "avanzado"])
    .withMessage("El nivel debe ser uno de: principiante, intermedio, avanzado"),
]

export const validateSupportMaterialUpdate = [
  body("titulo").optional().isLength({ min: 1, max: 255 }).withMessage("El título debe tener entre 1 y 255 caracteres"),

  body("tema").optional().isLength({ min: 1, max: 100 }).withMessage("El tema debe tener entre 1 y 100 caracteres"),

  body("contenido").optional().isLength({ min: 1 }).withMessage("El contenido no puede estar vacío"),

  body("tipo")
    .optional()
    .isIn(["documento", "video", "audio", "imagen", "enlace"])
    .withMessage("El tipo debe ser uno de: documento, video, audio, imagen, enlace"),

  body("nivel")
    .optional()
    .isIn(["principiante", "intermedio", "avanzado"])
    .withMessage("El nivel debe ser uno de: principiante, intermedio, avanzado"),
]

