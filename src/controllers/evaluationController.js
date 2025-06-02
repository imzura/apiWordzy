import Evaluation from "../models/evaluation.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuración para almacenamiento de archivos
const uploadsDir = path.join(__dirname, "../../uploads")

// Asegurar que el directorio de uploads existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Obtener todas las evaluaciones
export const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
    res.status(200).json(evaluations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Obtener una evaluación por ID
export const getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluación no encontrada" })
    }
    res.status(200).json(evaluation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Modificar la función createEvaluation para mejorar el manejo de archivos
export const createEvaluation = async (req, res) => {
  try {
    console.log("=== INICIO DE CREACIÓN DE EVALUACIÓN ===")
    console.log("Headers recibidos:", req.headers)
    console.log("Body keys:", Object.keys(req.body))
    console.log("Files keys:", req.files ? Object.keys(req.files) : "No hay archivos")

    // Verificar si hay archivos en la solicitud
    if (req.files) {
      console.log("Archivos recibidos:")
      for (const key in req.files) {
        console.log(`- ${key}:`, req.files[key].name)
      }
    }

    // Manejar material si existe
    let materialPath = null
    if (req.files && req.files.material) {
      const materialFile = req.files.material
      const fileExt = path.extname(materialFile.name)
      const fileName = `material_${Date.now()}${fileExt}`

      // Guardar el archivo en el sistema de archivos
      await materialFile.mv(path.join(uploadsDir, fileName))

      // Guardar la ruta completa para acceso desde el frontend
      materialPath = `/uploads/${fileName}`
      console.log("Material guardado en:", materialPath)
    }

    // Verificar si preguntas existe y su formato
    if (!req.body.preguntas) {
      return res.status(400).json({
        message: "Error al procesar los datos de la evaluación",
        error: "No se encontró el campo 'preguntas' en la solicitud",
      })
    }

    // Parsear las preguntas
    let preguntasData
    try {
      preguntasData = typeof req.body.preguntas === "string" ? JSON.parse(req.body.preguntas) : req.body.preguntas
      console.log(
        "Preguntas parseadas:",
        Array.isArray(preguntasData) ? `Array con ${preguntasData.length} elementos` : typeof preguntasData,
      )
    } catch (parseError) {
      console.error("Error al parsear preguntas:", parseError)
      return res.status(400).json({
        message: "Error al procesar los datos de la evaluación",
        error: `Error al parsear el campo 'preguntas': ${parseError.message}`,
      })
    }

    // Procesar preguntas y sus archivos
    if (Array.isArray(preguntasData)) {
      for (let i = 0; i < preguntasData.length; i++) {
        const pregunta = preguntasData[i]
        console.log(`Procesando pregunta ${i + 1} de tipo ${pregunta.tipo}`)

        // Manejar imágenes
        if (pregunta.tipo === "imagen") {
          // Buscar el archivo de imagen por su clave en req.files
          const imagenKey = pregunta.imagen
          console.log(`Buscando archivo de imagen con clave: ${imagenKey}`)

          if (req.files && req.files[imagenKey]) {
            const imagenFile = req.files[imagenKey]
            const fileExt = path.extname(imagenFile.name)
            const fileName = `imagen_${Date.now()}_${i}${fileExt}`

            // Guardar el archivo en el sistema de archivos
            await imagenFile.mv(path.join(uploadsDir, fileName))

            // Guardar la ruta completa para acceso desde el frontend
            pregunta.imagen = `/uploads/${fileName}`
            console.log(`Imagen guardada en: ${pregunta.imagen}`)
          } else {
            // Buscar cualquier archivo que pueda ser la imagen
            let encontrado = false
            if (req.files) {
              for (const key in req.files) {
                if (key.includes("imagen") || key.includes("image")) {
                  const imagenFile = req.files[key]
                  const fileExt = path.extname(imagenFile.name)
                  const fileName = `imagen_${Date.now()}_${i}${fileExt}`
                  const imagenPath = `/uploads/${fileName}`

                  await imagenFile.mv(path.join(uploadsDir, fileName))
                  pregunta.imagen = imagenPath
                  console.log(`Imagen encontrada con clave ${key} y guardada en: ${imagenPath}`)
                  encontrado = true
                  break
                }
              }
            }

            if (!encontrado) {
              console.log(`No se encontró archivo de imagen para la pregunta ${i + 1}`)
              // Si no hay archivo, asegurarse que imagen sea null
              if (typeof pregunta.imagen === "object") {
                pregunta.imagen = null
              }
            }
          }
        }

        // Manejar audios (similar a imágenes)
        if (pregunta.tipo === "audio") {
          const audioKey = pregunta.audio
          console.log(`Buscando archivo de audio con clave: ${audioKey}`)

          if (req.files && req.files[audioKey]) {
            const audioFile = req.files[audioKey]
            const fileExt = path.extname(audioFile.name)
            const fileName = `audio_${Date.now()}_${i}${fileExt}`
            const audioPath = `/uploads/${fileName}`

            await audioFile.mv(path.join(uploadsDir, fileName))
            pregunta.audio = audioPath
            console.log(`Audio guardado en: ${audioPath}`)
          } else {
            // Buscar cualquier archivo que pueda ser el audio
            let encontrado = false
            if (req.files) {
              for (const key in req.files) {
                if (key.includes("audio")) {
                  const audioFile = req.files[key]
                  const fileExt = path.extname(audioFile.name)
                  const fileName = `audio_${Date.now()}_${i}${fileExt}`
                  const audioPath = `/uploads/${fileName}`

                  await audioFile.mv(path.join(uploadsDir, fileName))
                  pregunta.audio = audioPath
                  console.log(`Audio encontrado con clave ${key} y guardado en: ${audioPath}`)
                  encontrado = true
                  break
                }
              }
            }

            if (!encontrado) {
              console.log(`No se encontró archivo de audio para la pregunta ${i + 1}`)
              // Si no hay archivo, asegurarse que audio sea null
              if (typeof pregunta.audio === "object") {
                pregunta.audio = null
              }
            }
          }
        }
      }
    }

    // Crear la evaluación
    const evaluationData = {
      nombre: req.body.nombre,
      tematica: req.body.tematica,
      tipoEvaluacion: req.body.tipoEvaluacion,
      estado: req.body.estado,
      descripcion: req.body.descripcion,
      material: materialPath,
      preguntas: preguntasData,
    }

    console.log("Datos finales para crear evaluación:", {
      nombre: evaluationData.nombre,
      tematica: evaluationData.tematica,
      tipoEvaluacion: evaluationData.tipoEvaluacion,
      estado: evaluationData.estado,
      descripcion: evaluationData.descripcion ? evaluationData.descripcion.substring(0, 50) + "..." : null,
      material: evaluationData.material,
      preguntas: `Array con ${evaluationData.preguntas.length} elementos`,
    })

    const newEvaluation = new Evaluation(evaluationData)
    const savedEvaluation = await newEvaluation.save()
    console.log("Evaluación guardada con éxito, ID:", savedEvaluation._id)
    console.log("=== FIN DE CREACIÓN DE EVALUACIÓN ===")
    res.status(201).json(savedEvaluation)
  } catch (error) {
    console.error("Error general en createEvaluation:", error)
    res.status(400).json({
      message: "Error al procesar los datos de la evaluación",
      error: error.message,
    })
  }
}

// Actualizar una evaluación
export const updateEvaluation = async (req, res) => {
  try {
    console.log("=== INICIO DE ACTUALIZACIÓN DE EVALUACIÓN ===")
    console.log("ID de evaluación a actualizar:", req.params.id)
    console.log("Headers recibidos:", req.headers)
    console.log("Body keys:", Object.keys(req.body))
    console.log("Files keys:", req.files ? Object.keys(req.files) : "No hay archivos")

    const evaluationId = req.params.id
    const existingEvaluation = await Evaluation.findById(evaluationId)

    if (!existingEvaluation) {
      console.log("Evaluación no encontrada con ID:", evaluationId)
      return res.status(404).json({ message: "Evaluación no encontrada" })
    }

    // Manejar material si existe
    let materialPath = existingEvaluation.material
    if (req.files && req.files.material) {
      // Eliminar material anterior si existe
      if (materialPath) {
        const fullPath = path.join(__dirname, "..", materialPath)
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
          console.log("Material anterior eliminado:", fullPath)
        }
      }

      const materialFile = req.files.material
      const fileExt = path.extname(materialFile.name)
      const fileName = `material_${Date.now()}${fileExt}`
      materialPath = `/uploads/${fileName}`

      // Guardar el nuevo archivo
      await materialFile.mv(path.join(uploadsDir, fileName))
      console.log("Nuevo material guardado en:", materialPath)
    }

    // Verificar si preguntas existe y su formato
    if (!req.body.preguntas) {
      return res.status(400).json({
        message: "Error al procesar los datos de la evaluación",
        error: "No se encontró el campo 'preguntas' en la solicitud",
      })
    }

    // Parsear las preguntas
    let preguntasData
    try {
      preguntasData = typeof req.body.preguntas === "string" ? JSON.parse(req.body.preguntas) : req.body.preguntas
      console.log(
        "Preguntas parseadas:",
        Array.isArray(preguntasData) ? `Array con ${preguntasData.length} elementos` : typeof preguntasData,
      )
    } catch (parseError) {
      console.error("Error al parsear preguntas:", parseError)
      return res.status(400).json({
        message: "Error al procesar los datos de la evaluación",
        error: `Error al parsear el campo 'preguntas': ${parseError.message}`,
      })
    }

    // Procesar preguntas y sus archivos
    if (Array.isArray(preguntasData)) {
      for (let i = 0; i < preguntasData.length; i++) {
        const pregunta = preguntasData[i]
        console.log(`Procesando pregunta ${i + 1} de tipo ${pregunta.tipo}`)

        // Manejar imágenes
        if (pregunta.tipo === "imagen") {
          const imagenKey = pregunta.imagen
          if (req.files && req.files[imagenKey]) {
            // Si hay un nuevo archivo de imagen
            const imagenFile = req.files[imagenKey]
            const fileExt = path.extname(imagenFile.name)
            const fileName = `imagen_${Date.now()}_${i}${fileExt}`
            const imagenPath = `/uploads/${fileName}`

            // Guardar el archivo en el sistema de archivos
            await imagenFile.mv(path.join(uploadsDir, fileName))
            pregunta.imagen = imagenPath
            console.log(`Imagen guardada en: ${imagenPath}`)
          } else if (typeof pregunta.imagen === "object") {
            // Si no hay nuevo archivo y el valor es un objeto, mantener el valor existente o null
            const existingPregunta = existingEvaluation.preguntas.find((p) => p.id === pregunta.id)
            pregunta.imagen = existingPregunta ? existingPregunta.imagen : null
            console.log(`Manteniendo imagen existente para pregunta ${i + 1}:`, pregunta.imagen)
          }
        }

        // Manejar audios
        if (pregunta.tipo === "audio") {
          const audioKey = pregunta.audio
          if (req.files && req.files[audioKey]) {
            // Si hay un nuevo archivo de audio
            const audioFile = req.files[audioKey]
            const fileExt = path.extname(audioFile.name)
            const fileName = `audio_${Date.now()}_${i}${fileExt}`
            const audioPath = `/uploads/${fileName}`

            // Guardar el archivo en el sistema de archivos
            await audioFile.mv(path.join(uploadsDir, fileName))
            pregunta.audio = audioPath
            console.log(`Audio guardado en: ${audioPath}`)
          } else if (typeof pregunta.audio === "object") {
            // Si no hay nuevo archivo y el valor es un objeto, mantener el valor existente o null
            const existingPregunta = existingEvaluation.preguntas.find((p) => p.id === pregunta.id)
            pregunta.audio = existingPregunta ? existingPregunta.audio : null
            console.log(`Manteniendo audio existente para pregunta ${i + 1}:`, pregunta.audio)
          }
        }
      }
    }

    // Actualizar la evaluación
    const evaluationData = {
      nombre: req.body.nombre || existingEvaluation.nombre,
      tematica: req.body.tematica || existingEvaluation.tematica,
      tipoEvaluacion: req.body.tipoEvaluacion || existingEvaluation.tipoEvaluacion,
      estado: req.body.estado || existingEvaluation.estado,
      descripcion: req.body.descripcion || existingEvaluation.descripcion,
      material: materialPath,
      preguntas: preguntasData,
    }

    console.log("Datos finales para actualizar evaluación:", {
      nombre: evaluationData.nombre,
      tematica: evaluationData.tematica,
      tipoEvaluacion: evaluationData.tipoEvaluacion,
      estado: evaluationData.estado,
      descripcion: evaluationData.descripcion ? evaluationData.descripcion.substring(0, 50) + "..." : null,
      material: evaluationData.material,
      preguntas: `Array con ${evaluationData.preguntas.length} elementos`,
    })

    const updatedEvaluation = await Evaluation.findByIdAndUpdate(evaluationId, evaluationData, { new: true })
    console.log("Evaluación actualizada con éxito, ID:", updatedEvaluation._id)
    console.log("=== FIN DE ACTUALIZACIÓN DE EVALUACIÓN ===")
    res.status(200).json(updatedEvaluation)
  } catch (error) {
    console.error("Error general en updateEvaluation:", error)
    res.status(400).json({
      message: "Error al procesar los datos de la evaluación",
      error: error.message,
    })
  }
}

// Eliminar una evaluación
export const deleteEvaluation = async (req, res) => {
  try {
    console.log("=== INICIO DE ELIMINACIÓN DE EVALUACIÓN ===")
    console.log("ID de evaluación a eliminar:", req.params.id)

    const evaluation = await Evaluation.findById(req.params.id)

    if (!evaluation) {
      console.log("Evaluación no encontrada con ID:", req.params.id)
      return res.status(404).json({ message: "Evaluación no encontrada" })
    }

    // Eliminar archivos asociados si existen
    if (evaluation.material) {
      const materialPath = path.join(__dirname, "..", evaluation.material)
      if (fs.existsSync(materialPath)) {
        fs.unlinkSync(materialPath)
        console.log("Material eliminado:", materialPath)
      }
    }

    // Eliminar archivos de preguntas
    for (const pregunta of evaluation.preguntas) {
      if (pregunta.imagen) {
        const imagenPath = path.join(__dirname, "..", pregunta.imagen)
        if (fs.existsSync(imagenPath)) {
          fs.unlinkSync(imagenPath)
          console.log("Imagen eliminada:", imagenPath)
        }
      }

      if (pregunta.audio) {
        const audioPath = path.join(__dirname, "..", pregunta.audio)
        if (fs.existsSync(audioPath)) {
          fs.unlinkSync(audioPath)
          console.log("Audio eliminado:", audioPath)
        }
      }
    }

    await Evaluation.findByIdAndDelete(req.params.id)
    console.log("Evaluación eliminada con éxito, ID:", req.params.id)
    console.log("=== FIN DE ELIMINACIÓN DE EVALUACIÓN ===")
    res.status(200).json({ message: "Evaluación eliminada correctamente" })
  } catch (error) {
    console.error("Error en deleteEvaluation:", error)
    res.status(500).json({ message: error.message })
  }
}
