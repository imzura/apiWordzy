import FichaLevelAssignment from "../models/fichaLevelAssignment.js"
import Course from "../models/course.js"
import Program from "../models/program.js"

// Función helper para obtener instructores desde la API
async function getInstructors() {
  try {
    const response = await fetch("http://localhost:3000/api/instructor")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const instructors = await response.json()
    console.log("Instructores obtenidos:", instructors.length)
    return instructors || []
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return []
  }
}

// Función helper para obtener aprendices desde la API
async function getApprentices() {
  try {
    const response = await fetch("http://localhost:3000/api/apprentice")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const apprentices = await response.json()
    console.log("Aprendices obtenidos:", apprentices.length)
    return apprentices || []
  } catch (error) {
    console.error("Error fetching apprentices:", error)
    return []
  }
}

// Función helper para encontrar el instructor de una ficha específica
function findInstructorByFicha(instructors, fichaCode) {
  console.log("Buscando instructor para ficha:", fichaCode)
  console.log("Total instructores disponibles:", instructors.length)

  for (const instructor of instructors) {
    console.log(`Revisando instructor: ${instructor.nombre} ${instructor.apellido}`)

    if (instructor.fichas && Array.isArray(instructor.fichas)) {
      console.log(
        `Fichas del instructor:`,
        instructor.fichas.map((f) => f.code || f.id),
      )

      const ficha = instructor.fichas.find((f) => {
        const fichaNumero = f.code || f.id || f._id?.toString()
        const match = fichaNumero === fichaCode || fichaNumero?.toString() === fichaCode?.toString()
        console.log(`Comparando ${fichaNumero} con ${fichaCode}: ${match}`)
        return match
      })

      if (ficha) {
        console.log(`✅ Instructor encontrado: ${instructor.nombre} ${instructor.apellido}`)
        return {
          instructor: instructor,
          ficha: ficha,
        }
      }
    } else {
      console.log(`Instructor ${instructor.nombre} no tiene fichas asignadas`)
    }
  }

  console.log("❌ No se encontró instructor para la ficha")
  return null
}

// ✅ NUEVA FUNCIÓN: Buscar fichas por nombre de instructor
function findFichasByInstructorName(instructors, searchTerm) {
  console.log("Buscando fichas por instructor:", searchTerm)
  const searchRegex = new RegExp(searchTerm, "i")
  const matchingFichas = []

  for (const instructor of instructors) {
    const fullName = `${instructor.nombre || ""} ${instructor.apellido || ""}`.trim()
    const firstName = instructor.nombre || ""
    const lastName = instructor.apellido || ""

    // Buscar coincidencias en nombre completo, nombre o apellido
    if (searchRegex.test(fullName) || searchRegex.test(firstName) || searchRegex.test(lastName)) {
      console.log(`✅ Instructor coincidente: ${fullName}`)

      // Agregar todas las fichas de este instructor
      if (instructor.fichas && Array.isArray(instructor.fichas)) {
        instructor.fichas.forEach((ficha) => {
          const fichaCode = ficha.code || ficha.id || ficha._id?.toString()
          if (fichaCode) {
            matchingFichas.push({
              code: fichaCode,
              instructorName: fullName,
              instructor: instructor,
            })
            console.log(`  - Ficha encontrada: ${fichaCode}`)
          }
        })
      }
    }
  }

  console.log(`Total fichas encontradas por instructor: ${matchingFichas.length}`)
  return matchingFichas
}

// Función helper para obtener aprendices de una ficha específica
function getApprenticesByFicha(apprentices, fichaCode) {
  console.log("Buscando aprendices para ficha:", fichaCode)
  console.log("Total aprendices disponibles:", apprentices.length)

  const fichaApprentices = apprentices.filter((apprentice) => {
    // El campo ficha puede ser un array o un valor único
    const fichaArray = Array.isArray(apprentice.ficha) ? apprentice.ficha : [apprentice.ficha]

    const isInFicha = fichaArray.some((f) => {
      const fichaValue = f?.toString() || f
      const match = fichaValue === fichaCode || fichaValue === fichaCode?.toString()
      return match
    })

    if (isInFicha) {
      console.log(`✅ Aprendiz encontrado: ${apprentice.nombre} ${apprentice.apellido}`)
    }

    return isInFicha
  })

  console.log(`Total aprendices encontrados para ficha ${fichaCode}: ${fichaApprentices.length}`)
  return fichaApprentices
}

// Función helper para contar estudiantes de una ficha
function countStudentsInFicha(apprentices) {
  return apprentices ? apprentices.length : 0
}

// Función helper para obtener nombre completo del instructor
function getInstructorFullName(instructor) {
  if (!instructor) return "Por definir"
  return `${instructor.nombre || ""} ${instructor.apellido || ""}`.trim() || "Por definir"
}

// Función helper para obtener descripción por defecto según el índice del nivel (progresión hasta B1)
function getDefaultDescription(index, levelName) {
  const descriptions = [
    "Saludos básicos, números, alfabeto, presentación personal y vocabulario esencial.", // N1 - Pre-A1
    "Información personal, familia, rutinas diarias, presente simple y vocabulario.", // N2 - A1 inicial
    "Pasado simple, futuro con 'going to', describir experiencias y hablar de planes.", // N3 - A1 consolidado
    "Presente perfecto, comparativos, dar direcciones y expresar preferencias.", // N4 - A2 inicial
    "Condicionales, voz pasiva, narrar historias y describir situaciones hipotéticas.", // N5 - A2 consolidado
    "Tiempos perfectos, expresiones idiomáticas, debates simples y comunicación fluida básica.", // N6 - B1 inicial
  ]

  return descriptions[index] || `Nivel ${levelName} - Contenidos específicos del programa de inglés.`
}

// Obtener asignación de niveles por ficha
export async function getFichaLevelAssignment(req, res) {
  try {
    const { courseId } = req.params

    console.log("=== OBTENIENDO NIVELES PARA FICHA ===")
    console.log("CourseId:", courseId)

    // Verificar que la ficha existe
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        message: "Ficha no encontrada",
      })
    }

    console.log("Ficha encontrada:", course.code)

    // Obtener instructores y aprendices para buscar información real
    const [instructors, apprentices] = await Promise.all([getInstructors(), getApprentices()])

    const instructorFichaData = findInstructorByFicha(instructors, course.code)
    const fichaApprentices = getApprenticesByFicha(apprentices, course.code)
    const studentsCount = countStudentsInFicha(fichaApprentices)
    const instructorName = getInstructorFullName(instructorFichaData?.instructor)

    console.log("=== DATOS ENCONTRADOS ===")
    console.log("Instructor encontrado:", instructorName)
    console.log("Cantidad de estudiantes:", studentsCount)
    console.log(
      "Aprendices:",
      fichaApprentices.map((a) => `${a.nombre} ${a.apellido}`),
    )

    // Buscar el programa asociado - puede ser por ID o por nombre
    let program = null

    // Primero intentar buscar por ObjectId
    try {
      program = await Program.findById(course.fk_programs)
    } catch (error) {
      // Si falla, es porque fk_programs no es un ObjectId válido
      console.log("fk_programs no es un ObjectId, buscando por nombre...")
    }

    // Si no se encontró por ID, buscar por nombre
    if (!program) {
      program = await Program.findOne({
        $or: [{ name: course.fk_programs }, { code: course.fk_programs }],
      })
    }

    if (!program) {
      return res.status(404).json({
        message: "Programa asociado no encontrado",
        details: `No se encontró programa con identificador: ${course.fk_programs}`,
      })
    }

    console.log("Programa encontrado:", program.name)

    // Verificar que existe programación para este programa
    let courseProgramming = null
    try {
      const programmingResponse = await fetch("http://localhost:3000/api/course-programming")

      if (!programmingResponse.ok) {
        throw new Error(`HTTP error! status: ${programmingResponse.status}`)
      }

      const programmings = await programmingResponse.json()

      courseProgramming = programmings.find(
        (p) => p.programId._id === program._id.toString() || p.programId.name === program.name,
      )
    } catch (error) {
      console.error("Error fetching course programmings:", error)
    }

    // Si no hay programación, retornar error específico
    if (!courseProgramming) {
      return res.status(400).json({
        message: "No hay programación de inglés para este programa",
        details: `El programa ${program.name} no tiene una programación de inglés creada`,
        hasNoProgramming: true,
        courseInfo: {
          code: course.code,
          startDate: course.start_date,
          endDate: course.end_date,
          status: course.course_status,
          instructor: instructorName,
          studentsCount: studentsCount,
        },
        programInfo: {
          name: program.name,
          code: program.code,
          level: program.fk_level,
          modality: program.fk_modality,
        },
      })
    }

    console.log("Programación encontrada:", courseProgramming._id)

    // Buscar asignación usando fichaId en lugar de courseId
    const assignment = await FichaLevelAssignment.findOne({
      fichaId: courseId,
      status: true,
    })

    console.log("Asignación encontrada:", assignment ? assignment._id : "No existe")
    if (assignment) {
      console.log("Niveles en la asignación:", JSON.stringify(assignment.levels, null, 2))
    }

    // Mapear los niveles de la programación a la estructura esperada con descripciones por defecto
    const programmingLevels = courseProgramming.levels.map((level, index) => ({
      id: level.levelId || `level_${index + 1}`,
      name: level.name,
      description:
        level.description && level.description.length > 20
          ? level.description
          : getDefaultDescription(index, level.name),
      order: level.order || index + 1,
      duration: level.duration,
      color: getLevelColor(level.name), // Función helper para colores
      completed: level.completed || false, // ✅ Agregar el campo completed de la programación
    }))

    console.log("Niveles de programación mapeados:", JSON.stringify(programmingLevels, null, 2))

    let responseData = {}

    // Si no existe asignación, crear estructura vacía basada en la programación
    if (!assignment) {
      console.log("No hay asignación existente, creando estructura vacía")

      const emptyLevels = {}
      programmingLevels.forEach((level) => {
        emptyLevels[level.id] = false
      })

      responseData = {
        fichaId: courseId,
        fichaCode: course.code,
        programId: program._id,
        programmingId: courseProgramming._id,
        levels: emptyLevels,
        isDefault: true,
        hasNoAssignment: true,
      }
    } else {
      console.log("Asignación existente encontrada, procesando niveles")

      // Si existe asignación, verificar que tiene los niveles correctos
      const currentLevelIds = Object.keys(assignment.levels || {})
      const programmingLevelIds = programmingLevels.map((l) => l.id)

      console.log("IDs de niveles actuales:", currentLevelIds)
      console.log("IDs de niveles de programación:", programmingLevelIds)

      // Si los IDs no coinciden, actualizar la estructura
      const needsUpdate =
        !programmingLevelIds.every((id) => currentLevelIds.includes(id)) ||
        currentLevelIds.some((id) => !programmingLevelIds.includes(id))

      if (needsUpdate) {
        console.log("Necesita actualización de estructura de niveles")

        const updatedLevels = {}
        programmingLevels.forEach((level) => {
          // Mantener el valor anterior si existe, sino false
          updatedLevels[level.id] = assignment.levels[level.id] || false
        })

        console.log("Niveles actualizados:", JSON.stringify(updatedLevels, null, 2))

        assignment.levels = updatedLevels
        await FichaLevelAssignment.findByIdAndUpdate(assignment._id, { levels: updatedLevels })

        responseData = {
          _id: assignment._id,
          fichaId: assignment.fichaId,
          fichaCode: assignment.fichaCode,
          programId: assignment.programId,
          programmingId: assignment.programmingId,
          levels: updatedLevels,
          lastModifiedBy: assignment.lastModifiedBy,
          lastModifiedAt: assignment.lastModifiedAt,
          status: assignment.status,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt,
        }
      } else {
        console.log("Estructura de niveles correcta, usando asignación existente")

        responseData = {
          _id: assignment._id,
          fichaId: assignment.fichaId,
          fichaCode: assignment.fichaCode,
          programId: assignment.programId,
          programmingId: assignment.programmingId,
          levels: assignment.levels,
          lastModifiedBy: assignment.lastModifiedBy,
          lastModifiedAt: assignment.lastModifiedAt,
          status: assignment.status,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt,
        }
      }
    }

    // Agregar información adicional con datos reales
    responseData.courseInfo = {
      code: course.code,
      startDate: course.start_date,
      endDate: course.end_date,
      status: course.course_status,
      instructor: instructorName,
      studentsCount: studentsCount,
    }

    responseData.programInfo = {
      name: program.name,
      code: program.code,
      level: program.fk_level,
      modality: program.fk_modality,
    }

    responseData.programmingInfo = {
      id: courseProgramming._id,
      startDate: courseProgramming.startDate,
      endDate: courseProgramming.endDate,
      levelsCount: courseProgramming.levels.length,
      levels: programmingLevels,
    }

    console.log("=== RESPUESTA FINAL ===")
    console.log("Levels en respuesta:", JSON.stringify(responseData.levels, null, 2))
    console.log("CourseInfo:", JSON.stringify(responseData.courseInfo, null, 2))

    res.status(200).json(responseData)
  } catch (error) {
    console.error("Error al obtener asignación de niveles:", error)
    res.status(500).json({
      message: "Error al obtener asignación de niveles",
      error: error.message,
    })
  }
}

// Guardar/actualizar asignación de niveles
export async function saveFichaLevelAssignment(req, res) {
  try {
    const { courseId } = req.params
    const { levels, userId } = req.body

    console.log("=== GUARDANDO NIVELES ===")
    console.log("CourseId:", courseId)
    console.log("Levels recibidos:", JSON.stringify(levels, null, 2))
    console.log("UserId:", userId)

    // Validar que se proporcionen los datos necesarios
    if (!levels || !userId) {
      return res.status(400).json({
        message: "Faltan datos requeridos: levels, userId",
      })
    }

    // Verificar que la ficha existe
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        message: "Ficha no encontrada",
      })
    }

    console.log("Ficha encontrada:", course.code, "Programa:", course.fk_programs)

    // Buscar el programa asociado
    let program = null
    try {
      program = await Program.findById(course.fk_programs)
    } catch (error) {
      // Si falla, buscar por nombre
      program = await Program.findOne({
        $or: [{ name: course.fk_programs }, { code: course.fk_programs }],
      })
    }

    if (!program) {
      return res.status(404).json({
        message: "Programa asociado no encontrado",
      })
    }

    console.log("Programa encontrado:", program.name, "ID:", program._id)

    // Verificar que existe programación para este programa
    let courseProgramming = null
    try {
      const programmingResponse = await fetch("http://localhost:3000/api/course-programming")

      if (!programmingResponse.ok) {
        throw new Error(`HTTP error! status: ${programmingResponse.status}`)
      }

      const programmings = await programmingResponse.json()

      courseProgramming = programmings.find(
        (p) => p.programId._id === program._id.toString() || p.programId.name === program.name,
      )
    } catch (error) {
      console.error("Error fetching course programmings:", error)
    }

    if (!courseProgramming) {
      return res.status(400).json({
        message: "No se pueden asignar niveles sin programación de inglés",
        details: `El programa ${program.name} no tiene una programación de inglés creada`,
      })
    }

    console.log("Programación encontrada:", courseProgramming._id)

    // Validar niveles según el tipo de programa y la programación
    const validationResult = validateLevelsByProgrammingAndType(levels, program.fk_level, courseProgramming)
    if (!validationResult.isValid) {
      return res.status(400).json({
        message: validationResult.message,
      })
    }

    // Cambiar courseId por fichaId y courseCode por fichaCode
    const assignmentData = {
      fichaId: courseId,
      fichaCode: course.code,
      programId: program._id,
      programmingId: courseProgramming._id,
      levels,
      lastModifiedBy: userId,
      lastModifiedAt: new Date(),
      status: true,
    }

    console.log("Assignment data a guardar:", JSON.stringify(assignmentData, null, 2))

    // Buscar si ya existe una asignación usando fichaId
    let assignment = await FichaLevelAssignment.findOne({ fichaId: courseId })
    console.log("Asignación existente:", assignment ? assignment._id : "No existe")

    if (assignment) {
      console.log("Actualizando asignación existente:", assignment._id)
      console.log("Niveles anteriores:", JSON.stringify(assignment.levels, null, 2))

      // Actualizar existente
      assignment = await FichaLevelAssignment.findByIdAndUpdate(assignment._id, assignmentData, {
        new: true,
        runValidators: true,
      })

      console.log("Asignación actualizada - Nuevos niveles:", JSON.stringify(assignment.levels, null, 2))

      // Verificar que se guardó correctamente
      const verificacion = await FichaLevelAssignment.findById(assignment._id)
      console.log("Verificación en BD:", JSON.stringify(verificacion.levels, null, 2))

      res.status(200).json({
        message: `Niveles actualizados exitosamente para la ficha ${course.code}`,
        assignment,
      })
    } else {
      console.log("Creando nueva asignación")

      // Verificar si existe algún registro con fichaId o fichaCode null que pueda causar conflicto
      const conflictingRecord = await FichaLevelAssignment.findOne({
        $or: [{ fichaId: null }, { fichaCode: null }, { fichaId: courseId }, { fichaCode: course.code }],
      })

      if (conflictingRecord) {
        console.log("Registro conflictivo encontrado:", conflictingRecord)

        // Si es un registro con valores null, eliminarlo
        if (!conflictingRecord.fichaId || !conflictingRecord.fichaCode) {
          await FichaLevelAssignment.findByIdAndDelete(conflictingRecord._id)
          console.log("Registro con valores null eliminado")
        } else {
          // Si es un registro válido para la misma ficha, actualizarlo
          assignment = await FichaLevelAssignment.findByIdAndUpdate(conflictingRecord._id, assignmentData, {
            new: true,
            runValidators: true,
          })

          console.log("Registro existente actualizado:", assignment._id)

          return res.status(200).json({
            message: `Niveles actualizados exitosamente para la ficha ${course.code}`,
            assignment,
          })
        }
      }

      // Crear nuevo
      assignment = new FichaLevelAssignment(assignmentData)
      const savedAssignment = await assignment.save()

      console.log("Nueva asignación creada:", savedAssignment._id)
      console.log("Niveles guardados:", JSON.stringify(savedAssignment.levels, null, 2))

      res.status(201).json({
        message: `Niveles asignados exitosamente para la ficha ${course.code}`,
        assignment: savedAssignment,
      })
    }
  } catch (error) {
    console.error("Error al guardar asignación de niveles:", error)

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe una asignación para esta ficha",
        details: "Intenta actualizar la asignación existente en lugar de crear una nueva",
      })
    }

    res.status(500).json({
      message: "Error al guardar asignación de niveles",
      error: error.message,
    })
  }
}

// Función helper para validar niveles según programación y tipo de programa
function validateLevelsByProgrammingAndType(levels, programLevel, courseProgramming) {
  const providedLevels = Object.keys(levels)
  const programmingLevelsCount = courseProgramming.levels.length

  // Obtener los IDs válidos de la programación
  const validLevelIds = courseProgramming.levels.map((level, index) => level.levelId || `level_${index + 1}`)

  // Verificar que todos los niveles proporcionados son válidos según la programación
  const invalidLevels = providedLevels.filter((level) => !validLevelIds.includes(level))
  if (invalidLevels.length > 0) {
    return {
      isValid: false,
      message: `Niveles inválidos para esta programación: ${invalidLevels.join(", ")}. Niveles válidos: ${validLevelIds.join(", ")}`,
    }
  }

  // Validar según el tipo de programa
  if (programLevel === "TECNICO") {
    // Técnicos solo pueden tener activos hasta el número de niveles en la programación (máximo 3)
    const maxAllowedLevels = Math.min(programmingLevelsCount, 3)
    const activeLevels = Object.entries(levels).filter(([key, value]) => value === true)

    if (activeLevels.length > maxAllowedLevels) {
      return {
        isValid: false,
        message: `Los programas técnicos solo pueden tener activos ${maxAllowedLevels} niveles según su programación`,
      }
    }

    // Verificar que no se activen niveles más allá del límite permitido
    const allowedLevelIds = validLevelIds.slice(0, maxAllowedLevels)
    const restrictedActiveLevels = activeLevels.filter(([levelId]) => !allowedLevelIds.includes(levelId))

    if (restrictedActiveLevels.length > 0) {
      return {
        isValid: false,
        message: `Los programas técnicos solo pueden activar los primeros ${maxAllowedLevels} niveles de la programación`,
      }
    }
  } else if (programLevel === "TECNÓLOGO") {
    // Tecnólogos pueden tener hasta el número de niveles en la programación (máximo 6)
    const maxAllowedLevels = Math.min(programmingLevelsCount, 6)
    const activeLevels = Object.entries(levels).filter(([key, value]) => value === true)

    if (activeLevels.length > maxAllowedLevels) {
      return {
        isValid: false,
        message: `Este programa solo puede tener activos ${maxAllowedLevels} niveles según su programación`,
      }
    }

    // Verificar que no se activen niveles más allá del límite permitido
    const allowedLevelIds = validLevelIds.slice(0, maxAllowedLevels)
    const restrictedActiveLevels = activeLevels.filter(([levelId]) => !allowedLevelIds.includes(levelId))

    if (restrictedActiveLevels.length > 0) {
      return {
        isValid: false,
        message: `Este programa solo puede activar los primeros ${maxAllowedLevels} niveles de la programación`,
      }
    }
  }

  return { isValid: true }
}

// ✅ BÚSQUEDA MEJORADA: Buscar fichas - ACTUALIZADO para incluir búsqueda por instructor
export async function searchFichas(req, res) {
  try {
    const { q: searchTerm, limit = 10 } = req.query

    if (!searchTerm || searchTerm.trim().length < 2) {
      return res.status(400).json({
        message: "El término de búsqueda debe tener al menos 2 caracteres",
      })
    }

    console.log("=== BÚSQUEDA DE FICHAS ===")
    console.log("Término de búsqueda:", searchTerm)

    const searchRegex = new RegExp(searchTerm, "i")

    // Obtener instructores y aprendices para datos reales
    const [instructors, apprentices] = await Promise.all([getInstructors(), getApprentices()])

    // ✅ NUEVA FUNCIONALIDAD: Buscar fichas por nombre de instructor
    const fichasByInstructor = findFichasByInstructorName(instructors, searchTerm)
    const fichaCodesFromInstructors = fichasByInstructor.map((f) => f.code)

    console.log("Fichas encontradas por instructor:", fichaCodesFromInstructors)

    // Buscar en cursos - AMPLIADO para incluir fichas encontradas por instructor
    const courseQuery = {
      $or: [{ code: searchRegex }, { fk_programs: searchRegex }],
      status: true,
    }

    // Si encontramos fichas por instructor, agregarlas a la búsqueda
    if (fichaCodesFromInstructors.length > 0) {
      courseQuery.$or.push({ code: { $in: fichaCodesFromInstructors } })
    }

    console.log("Query de búsqueda:", JSON.stringify(courseQuery, null, 2))

    const courses = await Course.find(courseQuery).limit(Number.parseInt(limit)).sort({ updatedAt: -1 })

    console.log("Cursos encontrados:", courses.length)

    // Obtener información de programas
    const programNames = [...new Set(courses.map((course) => course.fk_programs))]
    const programs = await Program.find({
      $or: [
        { _id: { $in: programNames.filter((name) => /^[0-9a-fA-F]{24}$/.test(name)) } },
        { name: { $in: programNames } },
        { code: { $in: programNames } },
      ],
    })

    // Obtener programaciones
    let programmings = []
    try {
      const programmingResponse = await fetch("http://localhost:3000/api/course-programming")

      if (programmingResponse.ok) {
        programmings = await programmingResponse.json()
      }
    } catch (error) {
      console.error("Error fetching course programmings:", error)
    }

    // Obtener las asignaciones de niveles para cada ficha usando fichaId
    const courseIds = courses.map((course) => course._id)
    const assignments = await FichaLevelAssignment.find({
      fichaId: { $in: courseIds },
      status: true,
    })

    // Mapear resultados con información adicional - INCLUYENDO fichas sin programación
    const results = courses.map((course) => {
      // Buscar programa asociado
      const program = programs.find(
        (p) =>
          p._id.toString() === course.fk_programs || p.name === course.fk_programs || p.code === course.fk_programs,
      )

      // Buscar programación
      const programming = program
        ? programmings.find((p) => p.programId._id === program._id.toString() || p.programId.name === program.name)
        : null

      // Buscar instructor y contar estudiantes reales
      const instructorFichaData = findInstructorByFicha(instructors, course.code)
      const fichaApprentices = getApprenticesByFicha(apprentices, course.code)
      const studentsCount = countStudentsInFicha(fichaApprentices)
      const instructorName = getInstructorFullName(instructorFichaData?.instructor)

      const assignment = assignments.find((a) => a.fichaId.toString() === course._id.toString())
      const activeLevels = assignment ? Object.values(assignment.levels).filter(Boolean).length : 0

      // ✅ INDICAR SI LA FICHA FUE ENCONTRADA POR INSTRUCTOR
      const foundByInstructor = fichaCodesFromInstructors.includes(course.code)

      return {
        id: course._id,
        codigo: course.code,
        numero: course.code,
        programa: program?.name || "Programa no encontrado",
        programId: program?._id,
        programLevel: program?.fk_level,
        instructor: instructorName,
        aprendices: studentsCount,
        nivelesActivos: activeLevels,
        totalNiveles: programming ? programming.levels.length : 0,
        startDate: course.start_date,
        endDate: course.end_date,
        status: course.course_status,
        hasProgramming: !!programming,
        hasLevels: !!assignment,
        programmingLevels: programming ? programming.levels.map((l) => l.name) : [],
        // ✅ NUEVO CAMPO: Indicar si fue encontrada por instructor
        foundByInstructor: foundByInstructor,
        // Mensajes informativos
        statusMessage: !programming
          ? "Sin programación de inglés"
          : !assignment
            ? "Sin niveles asignados"
            : `${activeLevels}/${programming.levels.length} niveles activos`,
      }
    })

    console.log("=== RESULTADOS FINALES ===")
    console.log("Total resultados:", results.length)
    console.log("Encontrados por instructor:", results.filter((r) => r.foundByInstructor).length)

    // Retornar TODAS las fichas (con y sin programación)
    res.status(200).json(results)
  } catch (error) {
    console.error("Error al buscar fichas:", error)
    res.status(500).json({
      message: "Error al buscar fichas",
      error: error.message,
    })
  }
}

// Obtener todas las asignaciones - CORREGIDO con datos reales
export async function getAllFichaLevelAssignments(req, res) {
  try {
    const { page = 1, limit = 100, search } = req.query

    console.log("=== OBTENIENDO TODAS LAS ASIGNACIONES ===")
    console.log("Page:", page, "Limit:", limit, "Search:", search)

    // Obtener instructores y aprendices para datos reales
    const [instructors, apprentices] = await Promise.all([getInstructors(), getApprentices()])

    // Obtener programaciones primero
    let programmings = []
    try {
      const programmingResponse = await fetch("http://localhost:3000/api/course-programming")
      if (programmingResponse.ok) {
        programmings = await programmingResponse.json()
      }
    } catch (error) {
      console.error("Error fetching course programmings:", error)
    }

    console.log("Programaciones encontradas:", programmings.length)

    if (programmings.length === 0) {
      return res.status(200).json({
        assignments: [],
        pagination: {
          current: Number.parseInt(page),
          pages: 0,
          total: 0,
          totalCourses: 0,
        },
      })
    }

    // Obtener todos los programas que tienen programación (por nombre e ID)
    const programsWithProgramming = []
    programmings.forEach((programming) => {
      programsWithProgramming.push(programming.programId._id)
      programsWithProgramming.push(programming.programId.name)
    })

    console.log("Programas con programación (IDs y nombres):", programsWithProgramming)

    // Obtener todas las fichas cuyos programas tienen programación
    const courseQuery = {
      status: true,
      fk_programs: { $in: programsWithProgramming },
    }

    if (search) {
      const searchRegex = new RegExp(search, "i")
      courseQuery.$or = [{ code: searchRegex }]
    }

    const totalCourses = await Course.countDocuments(courseQuery)
    console.log("Total fichas con programación:", totalCourses)

    const courses = await Course.find(courseQuery)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    console.log("Fichas obtenidas:", courses.length)

    // Obtener información de programas
    const programNames = [...new Set(courses.map((course) => course.fk_programs))]
    const programs = await Program.find({
      $or: [
        { _id: { $in: programNames.filter((name) => /^[0-9a-fA-F]{24}$/.test(name)) } },
        { name: { $in: programNames } },
        { code: { $in: programNames } },
      ],
    })

    console.log("Programas obtenidos:", programs.length)

    // Obtener asignaciones existentes usando fichaId
    const courseIds = courses.map((course) => course._id)
    const assignments = await FichaLevelAssignment.find({
      fichaId: { $in: courseIds },
      status: true,
    })

    console.log("Asignaciones existentes:", assignments.length)

    // Procesar cada ficha
    const processedFichas = courses
      .map((course) => {
        // Buscar programa asociado
        const program = programs.find(
          (p) =>
            p._id.toString() === course.fk_programs || p.name === course.fk_programs || p.code === course.fk_programs,
        )

        if (!program) {
          console.log("Programa no encontrado para ficha:", course.code, "fk_programs:", course.fk_programs)
          return null
        }

        // Buscar programación
        const programming = programmings.find(
          (p) => p.programId._id === program._id.toString() || p.programId.name === program.name,
        )

        if (!programming) {
          console.log("Programación no encontrada para programa:", program.name)
          return null
        }

        // Buscar instructor y contar estudiantes reales
        const instructorFichaData = findInstructorByFicha(instructors, course.code)
        const fichaApprentices = getApprenticesByFicha(apprentices, course.code)
        const studentsCount = countStudentsInFicha(fichaApprentices)
        const instructorName = getInstructorFullName(instructorFichaData?.instructor)

        // Buscar asignación existente usando fichaId
        const assignment = assignments.find((a) => a.fichaId.toString() === course._id.toString())

        // Mapear niveles de la programación
        const programmingLevels = programming.levels.map((level, index) => ({
          id: level.levelId || `level_${index + 1}`,
          name: level.name,
          description: level.description || getDefaultDescription(index, level.name),
          order: level.order || index + 1,
        }))

        // Crear estructura de niveles con estados
        const levelsWithStatus = {}
        programmingLevels.forEach((level) => {
          const isActive = assignment ? assignment.levels[level.id] || false : false
          levelsWithStatus[level.name] = {
            id: level.id,
            name: level.name,
            isActive: isActive,
            description: level.description,
            order: level.order,
          }
        })

        const activeLevels = Object.values(levelsWithStatus).filter((level) => level.isActive).length

        return {
          _id: assignment?._id || null,
          courseId: {
            _id: course._id,
            code: course.code,
            start_date: course.start_date,
            end_date: course.end_date,
            course_status: course.course_status,
            instructor: instructorName,
            studentsCount: studentsCount,
          },
          courseCode: course.code,
          programId: {
            _id: program._id,
            name: program.name,
            code: program.code,
            fk_level: program.fk_level,
            fk_modality: program.fk_modality,
          },
          programmingId: programming._id,
          levels: assignment?.levels || {},
          levelsWithStatus: levelsWithStatus,
          activeLevelsCount: activeLevels,
          totalLevelsCount: programmingLevels.length,
          hasAssignment: !!assignment,
          lastModifiedBy: assignment?.lastModifiedBy || null,
          lastModifiedAt: assignment?.lastModifiedAt || null,
          status: assignment?.status !== false,
          createdAt: assignment?.createdAt || null,
          updatedAt: assignment?.updatedAt || null,
          programmingInfo: {
            id: programming._id,
            startDate: programming.startDate,
            endDate: programming.endDate,
            levelsCount: programming.levels.length,
            levelNames: programming.levels.map((l) => l.name),
          },
        }
      })
      .filter(Boolean) // Remover nulls

    console.log("Fichas procesadas:", processedFichas.length)

    res.status(200).json({
      assignments: processedFichas,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(totalCourses / limit),
        total: processedFichas.length,
        totalCourses: totalCourses,
      },
    })
  } catch (error) {
    console.error("Error al obtener asignaciones:", error)
    res.status(500).json({
      message: "Error al obtener asignaciones",
      error: error.message,
    })
  }
}

// Eliminar asignación (soft delete)
export async function deleteFichaLevelAssignment(req, res) {
  try {
    const { courseId } = req.params

    const assignment = await FichaLevelAssignment.findOneAndUpdate(
      { fichaId: courseId },
      { status: false },
      { new: true },
    )

    if (!assignment) {
      return res.status(404).json({
        message: "Asignación no encontrada",
      })
    }

    res.status(200).json({
      message: "Asignación eliminada correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar asignación:", error)
    res.status(500).json({
      message: "Error al eliminar asignación",
      error: error.message,
    })
  }
}

// Obtener estadísticas de asignaciones
export async function getFichaLevelStats(req, res) {
  try {
    const stats = await FichaLevelAssignment.aggregate([
      { $match: { status: true } },
      {
        $lookup: {
          from: "programs",
          localField: "programId",
          foreignField: "_id",
          as: "program",
        },
      },
      { $unwind: "$program" },
      {
        $group: {
          _id: "$program.fk_level",
          totalFichas: { $sum: 1 },
          totalActiveLevels: {
            $sum: {
              $size: {
                $filter: {
                  input: { $objectToArray: "$levels" },
                  cond: { $eq: ["$$this.v", true] },
                },
              },
            },
          },
          avgActiveLevels: {
            $avg: {
              $size: {
                $filter: {
                  input: { $objectToArray: "$levels" },
                  cond: { $eq: ["$$this.v", true] },
                },
              },
            },
          },
        },
      },
    ])

    const totalStats = await FichaLevelAssignment.countDocuments({ status: true })

    res.status(200).json({
      byProgramType: stats,
      total: totalStats,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({
      message: "Error al obtener estadísticas",
      error: error.message,
    })
  }
}

// Función helper para asignar colores a los niveles
function getLevelColor(levelName) {
  const colorMap = {
    A1: "bg-green-100 text-green-800",
    A2: "bg-blue-100 text-blue-800",
    B1: "bg-yellow-100 text-yellow-800",
    B2: "bg-orange-100 text-orange-800",
    C1: "bg-purple-100 text-purple-800",
    C2: "bg-red-100 text-red-800",
  }

  // Buscar por nombre exacto o por coincidencia parcial
  const exactMatch = colorMap[levelName]
  if (exactMatch) return exactMatch

  // Si no hay coincidencia exacta, asignar por orden
  const levelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"]
  const colors = Object.values(colorMap)

  for (let i = 0; i < levelOrder.length; i++) {
    if (levelName.includes(levelOrder[i])) {
      return colors[i]
    }
  }

  return "bg-gray-100 text-gray-800" // Color por defecto
}
