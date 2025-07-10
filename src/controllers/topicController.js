import Topic from "../models/topic.js"
import CourseProgramming from "../models/courseProgramming.js"

export async function getTopic(req, res) {
  try {
    const topics = await Topic.find()
    res.status(200).json(topics)
  } catch (error) {
    res.status(500).json({ message: "Error al cargar los temas", error })
  }
}

export async function postTopic(req, res) {
  try {
    const { name, description } = req.body

    const existingTopic = await Topic.findOne({ name })

    if (existingTopic) {
      return res.status(400).json({ message: "Ya existe un tema con ese nombre." })
    }

    const topic = new Topic({ name, description })
    await topic.save()

    res.status(201).json({ message: "Tema creado correctamente" })
  } catch (error) {
    res.status(500).json({ message: "Error al crear el tema", error })
  }
}

export async function putTopic(req, res) {
  const { id } = req.params
  const { name, status, description } = req.body

  try {
    // Obtener el tema actual para comparar estados
    const currentTopic = await Topic.findById(id)
    if (!currentTopic) {
      return res.status(404).json({ message: "Tema no encontrado" })
    }

    // Verifica si otro tema (con diferente ID) ya tiene ese nombre exacto
    const duplicate = await Topic.findOne({ name, _id: { $ne: id } })
    if (duplicate) {
      return res.status(400).json({ message: "Ya existe otro tema con ese nombre." })
    }

    // ✅ NUEVA VALIDACIÓN: Verificar si se intenta desactivar un tema que está en uso
    if (currentTopic.status === true && status === false) {
      // El tema se está intentando desactivar, verificar si está en uso
      const programmingsUsingTopic = await CourseProgramming.find({
        "levels.topics.topicId": id,
      }).populate("programId", "name")

      if (programmingsUsingTopic.length > 0) {
        // Obtener los nombres de los programas que usan este tema
        const programNames = programmingsUsingTopic.map(
          (programming) => programming.programId?.name || "Programa sin nombre",
        )

        const uniqueProgramNames = [...new Set(programNames)]
        const programList = uniqueProgramNames.join(", ")

        return res.status(400).json({
          message: `No se puede desactivar el tema "${currentTopic.name}" porque está siendo utilizado en las siguientes programaciones de cursos: ${programList}. Para desactivarlo, primero debe removerlo de todas las programaciones donde se encuentra.`,
          usedInPrograms: uniqueProgramNames,
          programmingsCount: programmingsUsingTopic.length,
          action: "deactivate",
        })
      }
    }

    // Si pasa todas las validaciones, actualizar el tema
    const updatedTopic = await Topic.findByIdAndUpdate(id, { name, status, description }, { new: true })

    res.status(200).json({
      message: "Tema actualizado exitosamente",
      updatedTopic,
    })
  } catch (error) {
    console.error("Error al actualizar el tema:", error)
    res.status(500).json({
      message: "Error interno del servidor al actualizar el tema",
      error: error.message,
    })
  }
}

// ✅ FUNCIÓN MEJORADA: Validación antes de eliminar tema
export async function deleteTopic(req, res) {
  const { id } = req.params

  try {
    // ✅ Verificar si el tema existe
    const topicToDelete = await Topic.findById(id)
    if (!topicToDelete) {
      return res.status(404).json({ message: "Tema no encontrado" })
    }

    // ✅ NUEVA VALIDACIÓN: Verificar si el tema está siendo utilizado en programaciones de cursos
    const programmingsUsingTopic = await CourseProgramming.find({
      "levels.topics.topicId": id,
    }).populate("programId", "name")

    if (programmingsUsingTopic.length > 0) {
      // Obtener los nombres de los programas que usan este tema
      const programNames = programmingsUsingTopic.map(
        (programming) => programming.programId?.name || "Programa sin nombre",
      )

      // Crear mensaje detallado
      const uniqueProgramNames = [...new Set(programNames)]
      const programList = uniqueProgramNames.join(", ")

      return res.status(400).json({
        message: `No se puede eliminar el tema "${topicToDelete.name}" porque está siendo utilizado en las siguientes programaciones de cursos: ${programList}. Para eliminarlo, primero debe removerlo de todas las programaciones donde se encuentra.`,
        usedInPrograms: uniqueProgramNames,
        programmingsCount: programmingsUsingTopic.length,
      })
    }

    // ✅ Si no está siendo utilizado, proceder con la eliminación
    const eliminatedTopic = await Topic.findByIdAndDelete(id)

    res.status(200).json({
      message: `Tema "${eliminatedTopic.name}" eliminado exitosamente`,
    })
  } catch (error) {
    console.error("Error al eliminar el tema:", error)
    res.status(500).json({
      message: "Error interno del servidor al eliminar el tema",
      error: error.message,
    })
  }
}

// ✅ NUEVA FUNCIÓN: Verificar si un tema está en uso (útil para el frontend)
export async function checkTopicUsage(req, res) {
  const { id } = req.params

  try {
    const topic = await Topic.findById(id)
    if (!topic) {
      return res.status(404).json({ message: "Tema no encontrado" })
    }

    // Buscar programaciones que usen este tema
    const programmingsUsingTopic = await CourseProgramming.find({
      "levels.topics.topicId": id,
    }).populate("programId", "name")

    const isInUse = programmingsUsingTopic.length > 0
    const programNames = programmingsUsingTopic.map(
      (programming) => programming.programId?.name || "Programa sin nombre",
    )

    res.status(200).json({
      topicId: id,
      topicName: topic.name,
      isInUse,
      usedInPrograms: [...new Set(programNames)],
      programmingsCount: programmingsUsingTopic.length,
    })
  } catch (error) {
    console.error("Error al verificar uso del tema:", error)
    res.status(500).json({
      message: "Error al verificar el uso del tema",
      error: error.message,
    })
  }
}
