import CourseProgramming from "../models/courseProgramming.js"
import Program from "../models/program.js"
import Topic from "../models/topic.js"
import Evaluation from "../models/evaluation.js"
import SupportMaterial from "../models/supportMaterial.js"

export async function getCourseProgramming(req, res) {
  try {
    const courses = await CourseProgramming.find().populate("programId")
    res.status(200).json(courses)
  } catch (error) {
    res.status(500).json({ message: "Error al cargar las programaciones", error })
  }
}

export async function createCourseProgramming(req, res) {
  try {
    const { programId, startDate, endDate, status, levels } = req.body

    // 1. Validar existencia del programa
    const program = await Program.findById(programId)
    if (!program) {
      return res.status(400).json({ message: "El programa no existe." })
    }

    // 2. Validar mínimo 3 niveles
    if (!Array.isArray(levels) || levels.length < 3) {
      return res.status(400).json({ message: "Debe incluir al menos 3 niveles." })
    }

    // 3. Validar que los primeros 3 niveles tengan nombre
    for (let i = 0; i < 3; i++) {
      const level = levels[i]
      if (!level.name || level.name.trim() === "") {
        return res.status(400).json({ message: `El nivel ${i + 1} debe tener un nombre.` })
      }
    }

    // 4. Recopilar todos los IDs primero
    const allTopicIds = []
    const allActivityIds = []
    const allExamIds = []
    const allMaterialIds = []

    // Recopilar IDs de todos los niveles
    for (const level of levels) {
      if (!Array.isArray(level.topics)) continue

      for (const topic of level.topics) {
        if (topic.topicId) {
          allTopicIds.push(topic.topicId)
        }

        // Recopilar IDs de actividades
        if (Array.isArray(topic.activities)) {
          for (const activity of topic.activities) {
            if (activity.evaluationId) {
              allActivityIds.push(activity.evaluationId)
            }
          }
        }

        // Recopilar IDs de exámenes
        if (Array.isArray(topic.exams)) {
          for (const exam of topic.exams) {
            if (exam.evaluationId) {
              allExamIds.push(exam.evaluationId)
            }
          }
        }

        // Recopilar IDs de materiales
        if (Array.isArray(topic.materials)) {
          for (const material of topic.materials) {
            if (material.materialId) {
              allMaterialIds.push(material.materialId)
            }
          }
        }
      }
    }

    // 5. Consultar la base de datos para validar existencia
    const [validTopics, validEvaluations, validMaterials] = await Promise.all([
      Topic.find({ _id: { $in: allTopicIds } }),
      Evaluation.find({ _id: { $in: [...allActivityIds, ...allExamIds] } }),
      SupportMaterial.find({ _id: { $in: allMaterialIds } }),
    ])

    // 6. Validar que todos los elementos existan
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

    // 7. Validar solo el primer nivel (lógica de negocio específica)
    const firstLevel = levels[0]

    if (!Array.isArray(firstLevel.topics) || firstLevel.topics.length === 0) {
      return res.status(400).json({ message: "El primer nivel debe contener al menos un tema." })
    }

    const topicSum = firstLevel.topics.reduce((sum, t) => sum + (t.value || 0), 0)
    if (topicSum !== 100) {
      return res.status(400).json({
        message: `La suma de valores de los temas en el primer nivel debe ser 100% (actual: ${topicSum}%)`,
      })
    }

    // 8. Validar cada tema del primer nivel
    for (const topic of firstLevel.topics) {
      if (!topic.topicId || topic.value == null) {
        return res.status(400).json({ message: "Cada tema debe tener un ID y un valor." })
      }

      // Buscar el tema en validTopics (ahora ya está inicializado)
      const topicDoc = validTopics.find((t) => t._id.toString() === topic.topicId.toString())
      if (!topicDoc) {
        return res.status(400).json({ message: `El tema ${topic.topicId} no existe.` })
      }

      // Asegurar que el nombre esté presente (el frontend ya lo envía, pero por seguridad)
      if (!topic.name || topic.name === "Sin nombre") {
        topic.name = topicDoc.name
      }

      // Validar actividades
      if (!Array.isArray(topic.activities) || topic.activities.length === 0) {
        return res.status(400).json({ message: "Cada tema debe tener al menos una actividad." })
      }
      const actSum = topic.activities.reduce((sum, a) => sum + (a.value || 0), 0)
      if (actSum !== 100) {
        return res.status(400).json({
          message: `Las actividades del tema ${topic.topicId} deben sumar 100% (actual: ${actSum}%)`,
        })
      }
      for (const activity of topic.activities) {
        if (!activity.evaluationId || activity.value == null) {
          return res.status(400).json({ message: "Cada actividad debe tener un ID y un valor." })
        }
      }

      // Validar exámenes
      if (!Array.isArray(topic.exams) || topic.exams.length === 0) {
        return res.status(400).json({ message: "Cada tema debe tener al menos un examen." })
      }
      const examSum = topic.exams.reduce((sum, e) => sum + (e.value || 0), 0)
      if (examSum !== 100) {
        return res.status(400).json({
          message: `Los exámenes del tema ${topic.topicId} deben sumar 100% (actual: ${examSum}%)`,
        })
      }
      for (const exam of topic.exams) {
        if (!exam.evaluationId || exam.value == null) {
          return res.status(400).json({ message: "Cada examen debe tener un ID y un valor." })
        }
      }

      // Validar materiales
      if (!Array.isArray(topic.materials) || topic.materials.length === 0) {
        return res.status(400).json({ message: "Cada tema debe tener al menos un material." })
      }
      for (const material of topic.materials) {
        if (!material.materialId) {
          return res.status(400).json({ message: "Cada material debe tener un ID." })
        }
      }
    }

    // 9. Asegurar que todos los temas tengan nombres correctos
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

    // 10. Crear programación
    const newProgramming = new CourseProgramming({
      programId,
      startDate,
      endDate,
      status,
      levels,
    })

    await newProgramming.save()

    return res.status(201).json({
      message: "Programación creada exitosamente.",
      programming: newProgramming,
    })
  } catch (error) {
    console.error("Error en createCourseProgramming:", error)
    return res.status(500).json({
      message: "Error al crear la programación.",
      error: error.message,
    })
  }
}

export async function getById(req, res) {
  try {
    const program = await CourseProgramming.findById(req.params.id)
      .populate("programId")
      .populate("levels.topics.topicId", "name") // populate tema
      .populate("levels.topics.activities.evaluationId") // populate actividad
      .populate("levels.topics.exams.evaluationId") // populate examen
      .populate("levels.topics.materials.materialId") // populate material
      .exec()

    if (!program) return res.status(404).json({ message: "No encontrado" })
    res.json(program)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function updateCourseProgramming(req, res) {
  try {
    const { id } = req.params
    const { programId, startDate, endDate, status, levels } = req.body

    // Verificar si existe la programación
    const existing = await CourseProgramming.findById(id)
    if (!existing) {
      return res.status(404).json({ message: "Programación no encontrada." })
    }

    // Validar existencia de programa
    const program = await Program.findById(programId)
    if (!program) {
      return res.status(400).json({ message: "El programa no existe." })
    }

    // Validar mínimo 3 niveles
    if (!Array.isArray(levels) || levels.length < 3) {
      return res.status(400).json({ message: "Debe incluir al menos 3 niveles." })
    }

    // Recopilar todos los IDs
    const allTopicIds = []
    const allActivityIds = []
    const allExamIds = []
    const allMaterialIds = []

    for (const level of levels) {
      if (!Array.isArray(level.topics) || level.topics.length === 0) {
        continue
      }

      for (const topic of level.topics) {
        if (!topic.topicId || topic.value == null) {
          return res.status(400).json({ message: "Cada tema debe tener un ID y un valor." })
        }
        allTopicIds.push(topic.topicId)

        // Validar actividades
        for (const activity of topic.activities || []) {
          if (!activity.evaluationId || activity.value == null) {
            return res.status(400).json({ message: "Cada actividad debe tener un ID y un valor." })
          }
          allActivityIds.push(activity.evaluationId)
        }

        // Validar exámenes
        for (const exam of topic.exams || []) {
          if (!exam.evaluationId || exam.value == null) {
            return res.status(400).json({ message: "Cada examen debe tener un ID y un valor." })
          }
          allExamIds.push(exam.evaluationId)
        }

        // Validar materiales
        for (const material of topic.materials || []) {
          if (!material.materialId) {
            return res.status(400).json({ message: "Cada material debe tener un ID." })
          }
          allMaterialIds.push(material.materialId)
        }
      }
    }

    // Verificar existencia real
    const [validTopics, validEvaluations, validMaterials] = await Promise.all([
      Topic.find({ _id: { $in: allTopicIds } }),
      Evaluation.find({ _id: { $in: [...allActivityIds, ...allExamIds] } }),
      SupportMaterial.find({ _id: { $in: allMaterialIds } }),
    ])

    if (validTopics.length !== allTopicIds.length) {
      return res.status(400).json({ message: "Algunos temas no existen." })
    }

    const evalMap = new Map(validEvaluations.map((e) => [e._id.toString(), e]))
    const invalidActivities = allActivityIds.filter((id) => {
      const e = evalMap.get(id.toString())
      return !e || e.tipoEvaluacion !== "Actividad"
    })
    const invalidExams = allExamIds.filter((id) => {
      const e = evalMap.get(id.toString())
      return !e || e.tipoEvaluacion !== "Examen"
    })

    if (invalidActivities.length > 0) {
      return res.status(400).json({ message: "Algunas actividades no son válidas o no existen." })
    }
    if (invalidExams.length > 0) {
      return res.status(400).json({ message: "Algunos exámenes no son válidos o no existen." })
    }
    if (validMaterials.length !== allMaterialIds.length) {
      return res.status(400).json({ message: "Algunos materiales de apoyo no existen." })
    }

    // Rellenar nombres de temas
    for (const level of levels) {
      for (const topic of level.topics) {
        const topicDoc = validTopics.find((t) => t._id.toString() === topic.topicId.toString())
        if (topicDoc && (!topic.name || topic.name === "Sin nombre")) {
          topic.name = topicDoc.name
        }
      }
    }

    // Actualizar campos
    existing.programId = programId
    existing.startDate = startDate
    existing.endDate = endDate
    existing.status = status
    existing.levels = levels

    await existing.save()

    return res.status(200).json({
      message: "Programación actualizada correctamente.",
      programming: existing,
    })
  } catch (error) {
    console.error(error)
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
    res.status(500).json({ message: "Error al eliminar la programación", error })
  }
}
