import CourseProgramming from "../models/courseProgramming.js"
import Program from "../models/program.js"
import Topic from "../models/topic.js"
import Evaluation from "../models/evaluation.js"
import SupportMaterial from "../models/supportMaterial.js"
import { updateLevelsCompletionStatus } from "../utils/levelValidation.js"
import mongoose from "mongoose"

export async function getCourseProgramming(req, res) {
  try {
    const courses = await CourseProgramming.find().populate("programId")
    res.status(200).json(courses)
  } catch (error) {
    console.error("Error en getCourseProgramming:", error)
    res.status(500).json({ message: "Error al cargar las programaciones", error: error.message })
  }
}

export async function createCourseProgramming(req, res) {
  try {
    console.log("📥 Datos recibidos:", JSON.stringify(req.body, null, 2))

    const { programId, startDate, endDate, status, levels } = req.body

    // Validaciones básicas...
    if (!programId) {
      return res.status(400).json({ message: "El ID del programa es requerido." })
    }

    if (!startDate) {
      return res.status(400).json({ message: "La fecha de inicio es requerida." })
    }

    // ✅ Validar mínimo 3 niveles y máximo 6 niveles
    if (!Array.isArray(levels)) {
      return res.status(400).json({ message: "Los niveles deben ser un array." })
    }

    if (levels.length < 3) {
      return res.status(400).json({ message: "Debe incluir al menos 3 niveles." })
    }

    if (levels.length > 6) {
      return res.status(400).json({ message: "No se pueden crear más de 6 niveles." })
    }

    // Función para procesar fechas correctamente
    const processDate = (dateString) => {
      if (!dateString) return null

      console.log("🔄 Procesando fecha:", dateString)

      if (dateString instanceof Date) {
        return dateString
      }

      const date = new Date(dateString)

      console.log("📅 Fecha procesada:", date)
      console.log("📅 Fecha en UTC:", date.toISOString())
      console.log("📅 Fecha local:", date.toLocaleDateString())

      return date
    }

    // Validar ObjectId format
    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({ message: "El ID del programa no es válido." })
    }

    // Validar existencia del programa
    const program = await Program.findById(programId)
    if (!program) {
      return res.status(400).json({ message: "El programa no existe." })
    }

    // Validar que los primeros 3 niveles tengan nombre
    for (let i = 0; i < Math.min(3, levels.length); i++) {
      const level = levels[i]
      if (!level.name || level.name.trim() === "") {
        return res.status(400).json({ message: `El nivel ${i + 1} debe tener un nombre.` })
      }
    }

    // Recopilar y validar IDs
    const allTopicIds = []
    const allActivityIds = []
    const allExamIds = []
    const allMaterialIds = []

    for (const level of levels) {
      if (!Array.isArray(level.topics)) {
        level.topics = []
        continue
      }

      for (const topic of level.topics) {
        if (topic.topicId && !mongoose.Types.ObjectId.isValid(topic.topicId)) {
          return res.status(400).json({ message: `ID de tema inválido: ${topic.topicId}` })
        }

        if (topic.topicId) {
          allTopicIds.push(topic.topicId)
        }

        if (Array.isArray(topic.activities)) {
          for (const activity of topic.activities) {
            if (activity.evaluationId) {
              if (!mongoose.Types.ObjectId.isValid(activity.evaluationId)) {
                return res.status(400).json({ message: `ID de actividad inválido: ${activity.evaluationId}` })
              }
              allActivityIds.push(activity.evaluationId)
            }
          }
        }

        if (Array.isArray(topic.exams)) {
          for (const exam of topic.exams) {
            if (exam.evaluationId) {
              if (!mongoose.Types.ObjectId.isValid(exam.evaluationId)) {
                return res.status(400).json({ message: `ID de examen inválido: ${exam.evaluationId}` })
              }
              allExamIds.push(exam.evaluationId)
            }
          }
        }

        if (Array.isArray(topic.materials)) {
          for (const material of topic.materials) {
            if (material.materialId) {
              if (!mongoose.Types.ObjectId.isValid(material.materialId)) {
                return res.status(400).json({ message: `ID de material inválido: ${material.materialId}` })
              }
              allMaterialIds.push(material.materialId)
            }
          }
        }
      }
    }

    // Consultar la base de datos para validar existencia
    let validTopics = []
    let validEvaluations = []
    let validMaterials = []

    if (allTopicIds.length > 0) {
      validTopics = await Topic.find({ _id: { $in: allTopicIds } })
    }

    if (allActivityIds.length > 0 || allExamIds.length > 0) {
      validEvaluations = await Evaluation.find({ _id: { $in: [...allActivityIds, ...allExamIds] } })
    }

    if (allMaterialIds.length > 0) {
      validMaterials = await SupportMaterial.find({ _id: { $in: allMaterialIds } })
    }

    // Validaciones de existencia
    const missingTopics = allTopicIds.filter((id) => !validTopics.some((t) => t._id.toString() === id.toString()))
    if (missingTopics.length > 0) {
      return res.status(400).json({
        message: `Algunos temas no existen: ${missingTopics.join(", ")}`,
      })
    }

    const invalidActivities = allActivityIds.filter(
      (id) => !validEvaluations.some((e) => e._id.toString() === id.toString() && e.tipoEvaluacion === "Actividad"),
    )
    if (invalidActivities.length > 0) {
      return res.status(400).json({
        message: `Algunas actividades no son válidas: ${invalidActivities.join(", ")}`,
      })
    }

    const invalidExams = allExamIds.filter(
      (id) => !validEvaluations.some((e) => e._id.toString() === id.toString() && e.tipoEvaluacion === "Examen"),
    )
    if (invalidExams.length > 0) {
      return res.status(400).json({
        message: `Algunos exámenes no son válidos: ${invalidExams.join(", ")}`,
      })
    }

    const missingMaterials = allMaterialIds.filter(
      (id) => !validMaterials.some((m) => m._id.toString() === id.toString()),
    )
    if (missingMaterials.length > 0) {
      return res.status(400).json({
        message: `Algunos materiales no existen: ${missingMaterials.join(", ")}`,
      })
    }

    // Validar solo el primer nivel si tiene temas
    const firstLevel = levels[0]
    if (Array.isArray(firstLevel.topics) && firstLevel.topics.length > 0) {
      const topicSum = firstLevel.topics.reduce((sum, t) => sum + (Number(t.value) || 0), 0)
      if (topicSum !== 100) {
        return res.status(400).json({
          message: `La suma de valores de los temas en el primer nivel debe ser 100% (actual: ${topicSum}%)`,
        })
      }

      for (const topic of firstLevel.topics) {
        if (!topic.topicId || topic.value == null) {
          return res.status(400).json({ message: "Cada tema debe tener un ID y un valor." })
        }

        const topicDoc = validTopics.find((t) => t._id.toString() === topic.topicId.toString())
        if (!topicDoc) {
          return res.status(400).json({ message: `El tema ${topic.topicId} no existe.` })
        }

        if (!topic.name || topic.name === "Sin nombre") {
          topic.name = topicDoc.name
        }

        if (Array.isArray(topic.activities) && topic.activities.length > 0) {
          const actSum = topic.activities.reduce((sum, a) => sum + (Number(a.value) || 0), 0)
          if (actSum !== 100) {
            return res.status(400).json({
              message: `Las actividades del tema ${topic.name} deben sumar 100% (actual: ${actSum}%)`,
            })
          }
        }

        if (Array.isArray(topic.exams) && topic.exams.length > 0) {
          const examSum = topic.exams.reduce((sum, e) => sum + (Number(e.value) || 0), 0)
          if (examSum !== 100) {
            return res.status(400).json({
              message: `Los exámenes del tema ${topic.name} deben sumar 100% (actual: ${examSum}%)`,
            })
          }
        }
      }
    }

    // Asegurar que todos los temas tengan nombres correctos
    for (const level of levels) {
      if (Array.isArray(level.topics)) {
        for (const topic of level.topics) {
          if (topic.topicId) {
            const topicDoc = validTopics.find((t) => t._id.toString() === topic.topicId.toString())
            if (topicDoc && (!topic.name || topic.name === "Sin nombre")) {
              topic.name = topicDoc.name
            }
          }
        }
      }
    }

    // ✅ Actualizar el estado de completado de todos los niveles antes de guardar
    const levelsWithCompletionStatus = updateLevelsCompletionStatus(levels)

    console.log("🔍 Estados de completado calculados:")
    levelsWithCompletionStatus.forEach((level, index) => {
      console.log(`Nivel ${index + 1} (${level.name}): ${level.completed ? "Completado" : "Sin completar"}`)
    })

    // Crear programación con fechas procesadas correctamente
    const programmingData = {
      programId,
      startDate: processDate(startDate),
      endDate: processDate(endDate),
      status: status !== undefined ? status : true,
      levels: levelsWithCompletionStatus,
    }

    console.log("💾 Datos finales a guardar:")
    console.log("startDate:", programmingData.startDate)
    console.log("endDate:", programmingData.endDate)
    console.log("Número de niveles:", levelsWithCompletionStatus.length)

    const newProgramming = new CourseProgramming(programmingData)
    await newProgramming.save()

    console.log("✅ Programación creada exitosamente")
    console.log("📅 Fecha guardada en BD:", newProgramming.startDate)

    return res.status(201).json({
      message: "Programación creada exitosamente.",
      programming: newProgramming,
    })
  } catch (error) {
    console.error("❌ Error en createCourseProgramming:", error)
    console.error("Stack trace:", error.stack)

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        message: "Error de validación",
        errors: validationErrors,
      })
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Error en el formato de los datos",
        error: error.message,
      })
    }

    return res.status(500).json({
      message: "Error interno del servidor al crear la programación.",
      error: error.message,
    })
  }
}

export async function getById(req, res) {
  try {
    const program = await CourseProgramming.findById(req.params.id)
      .populate("programId")
      .populate("levels.topics.topicId", "name")
      .populate("levels.topics.activities.evaluationId")
      .populate("levels.topics.exams.evaluationId")
      .populate("levels.topics.materials.materialId")
      .exec()

    if (!program) return res.status(404).json({ message: "No encontrado" })
    res.json(program)
  } catch (err) {
    console.error("Error en getById:", err)
    res.status(500).json({ message: err.message })
  }
}

export async function updateCourseProgramming(req, res) {
  try {
    const { id } = req.params
    const { programId, startDate, endDate, status, levels } = req.body

    const existing = await CourseProgramming.findById(id)
    if (!existing) {
      return res.status(404).json({ message: "Programación no encontrada." })
    }

    const program = await Program.findById(programId)
    if (!program) {
      return res.status(400).json({ message: "El programa no existe." })
    }

    // ✅ Validar límites de niveles en actualización
    if (!Array.isArray(levels) || levels.length < 3) {
      return res.status(400).json({ message: "Debe incluir al menos 3 niveles." })
    }

    if (levels.length > 6) {
      return res.status(400).json({ message: "No se pueden crear más de 6 niveles." })
    }

    // Procesar fechas para actualización
    const processDate = (dateString) => {
      if (!dateString) return null
      if (dateString instanceof Date) return dateString
      return new Date(dateString)
    }

    // ✅ Actualizar el estado de completado de todos los niveles antes de guardar
    const levelsWithCompletionStatus = updateLevelsCompletionStatus(levels)

    console.log("🔍 Estados de completado actualizados:")
    levelsWithCompletionStatus.forEach((level, index) => {
      console.log(`Nivel ${index + 1} (${level.name}): ${level.completed ? "Completado" : "Sin completar"}`)
    })

    existing.programId = programId
    existing.startDate = processDate(startDate)
    existing.endDate = processDate(endDate)
    existing.status = status !== undefined ? status : true
    existing.levels = levelsWithCompletionStatus

    await existing.save()

    return res.status(200).json({
      message: "Programación actualizada correctamente.",
      programming: existing,
    })
  } catch (error) {
    console.error("Error en updateCourseProgramming:", error)
    return res.status(500).json({
      message: "Error al actualizar la programación.",
      error: error.message,
    })
  }
}

export async function deleteCourseProgramming(req, res) {
  try {
    const deleteCourseProgramming = await CourseProgramming.findByIdAndDelete(req.params.id)

    if (!deleteCourseProgramming) {
      return res.status(404).json({ message: "Programación no encontrada" })
    }

    res.status(200).json({ message: "Programación eliminada exitosamente" })
  } catch (error) {
    console.error("Error en deleteCourseProgramming:", error)
    res.status(500).json({ message: "Error al eliminar la programación", error: error.message })
  }
}
