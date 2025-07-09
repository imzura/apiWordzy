/**
 * Función para validar si un nivel está completado
 * @param {Object} level - El nivel a validar
 * @returns {Object} - Objeto con el estado de completado y detalles
 */
export function validateLevelCompletion(level) {
  const details = {
    hasName: false,
    hasThemes: false,
    themesSum100: false, // ✅ Nueva validación para suma de temas
    themesValid: false,
    activitiesValid: false,
    examsValid: false,
    materialsValid: false,
  }

  // Verificar que el nivel tenga nombre
  if (!level.name || level.name.trim() === "") {
    return { completed: false, details }
  }
  details.hasName = true

  // Verificar que tenga al menos un tema
  if (!level.topics || level.topics.length === 0) {
    return { completed: false, details }
  }
  details.hasThemes = true

  // ✅ Verificar que los temas sumen 100%
  const topicsSum = level.topics.reduce((sum, topic) => {
    // Manejar diferentes formatos de valor
    let topicValue = 0
    if (typeof topic.value === "number") {
      topicValue = topic.value
    } else if (typeof topic.value === "string") {
      topicValue = Number.parseInt(topic.value.replace("%", "")) || 0
    } else if (topic.progress !== undefined) {
      // En el frontend se usa 'progress' en lugar de 'value'
      topicValue = Number(topic.progress) || 0
    }
    return sum + topicValue
  }, 0)

  if (topicsSum !== 100) {
    console.log(`❌ Temas no suman 100%: ${topicsSum}% en nivel "${level.name}"`)
    return { completed: false, details }
  }
  details.themesSum100 = true

  // Verificar cada tema individualmente
  let allThemesValid = true
  let allActivitiesValid = true
  let allExamsValid = true
  let allMaterialsValid = true

  for (const topic of level.topics) {
    // Verificar que el tema tenga un topicId seleccionado
    if (!topic.topicId) {
      allThemesValid = false
      break
    }

    // Verificar que tenga actividades
    const activities = topic.activities || []
    if (activities.length === 0) {
      allActivitiesValid = false
      break
    }

    // Verificar que las actividades sumen 100%
    const actSum = activities.reduce((sum, a) => {
      const value = Number(a.value || 0)
      return sum + value
    }, 0)
    if (actSum !== 100) {
      allActivitiesValid = false
      break
    }

    // Verificar que tenga exámenes
    const exams = topic.exams || []
    if (exams.length === 0) {
      allExamsValid = false
      break
    }

    // Verificar que los exámenes sumen 100%
    const examSum = exams.reduce((sum, e) => {
      const value = Number(e.value || 0)
      return sum + value
    }, 0)
    if (examSum !== 100) {
      allExamsValid = false
      break
    }

    // Verificar que tenga materiales de apoyo
    const materials = topic.materials || []
    if (materials.length === 0) {
      allMaterialsValid = false
      break
    }
  }

  details.themesValid = allThemesValid
  details.activitiesValid = allActivitiesValid
  details.examsValid = allExamsValid
  details.materialsValid = allMaterialsValid

  // ✅ El nivel está completado solo si TODAS las validaciones pasan, incluyendo la suma de temas
  const completed = details.themesSum100 && allThemesValid && allActivitiesValid && allExamsValid && allMaterialsValid

  console.log(`🔍 Validación nivel "${level.name}":`, {
    hasName: details.hasName,
    hasThemes: details.hasThemes,
    themesSum100: details.themesSum100,
    themesValid: details.themesValid,
    activitiesValid: details.activitiesValid,
    examsValid: details.examsValid,
    materialsValid: details.materialsValid,
    completed,
  })

  return { completed, details }
}

/**
 * Función para actualizar el estado de completado de todos los niveles
 * @param {Array} levels - Array de niveles
 * @returns {Array} - Array de niveles con estado actualizado
 */
export function updateLevelsCompletionStatus(levels) {
  return levels.map((level, index) => {
    const validation = validateLevelCompletion(level)
    console.log(`📊 Nivel ${index + 1} "${level.name}": ${validation.completed ? "COMPLETADO" : "SIN COMPLETAR"}`)
    return {
      ...level,
      completed: validation.completed,
      completionDetails: validation.details,
    }
  })
}

/**
 * Función específica para validar la suma de temas de un nivel
 * @param {Object} level - El nivel a validar
 * @returns {Object} - Objeto con información de la suma
 */
export function validateThemesSum(level) {
  if (!level.topics || level.topics.length === 0) {
    return { sum: 0, isValid: false, message: "No hay temas configurados" }
  }

  const sum = level.topics.reduce((total, topic) => {
    let topicValue = 0
    if (typeof topic.value === "number") {
      topicValue = topic.value
    } else if (typeof topic.value === "string") {
      topicValue = Number.parseInt(topic.value.replace("%", "")) || 0
    } else if (topic.progress !== undefined) {
      topicValue = Number(topic.progress) || 0
    }
    return total + topicValue
  }, 0)

  const isValid = sum === 100
  const message = isValid ? "Los temas suman correctamente 100%" : `Los temas suman ${sum}% (debe ser 100%)`

  return { sum, isValid, message }
}
