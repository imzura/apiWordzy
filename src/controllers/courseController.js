
import Course from "../models/course.js"
import axios from "axios"

const EXTERNAL_API_URL = "https://sara-api-ingdanielbs-projects.vercel.app/api/v1/courses"
const API_KEY = "sara_d32775a2ea8a39a3.a14bb968e21a6be6821d19f2764945338ba182b972aff43732b0c7c8314d343a"

export async function getCourses(req, res) {
  try {
    console.log("🔍 Obteniendo cursos...")
    const courses = await Course.find()
    console.log(`✅ Encontrados ${courses.length} cursos`)
    res.status(200).json(courses)
  } catch (error) {
    console.error("❌ Error al cargar los cursos:", error)
    res.status(500).json({ message: "Error al cargar los cursos", error: error.message })
  }
}

export async function getCourseById(req, res) {
  try {
    const { id } = req.params
    const course = await Course.findById(id)

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" })
    }

    res.status(200).json(course)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el curso", error })
  }
}

export async function createCourse(req, res) {
  try {
    const courseData = req.body
    const newCourse = new Course(courseData)
    const savedCourse = await newCourse.save()

    res.status(201).json(savedCourse)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe un curso con ese código",
      })
    }
    res.status(500).json({ message: "Error al crear el curso", error })
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params
    const updateData = req.body

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    if (!updatedCourse) {
      return res.status(404).json({ message: "Curso no encontrado" })
    }

    res.status(200).json(updatedCourse)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe un curso con ese código",
      })
    }
    res.status(500).json({ message: "Error al actualizar el curso", error })
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params
    const deletedCourse = await Course.findByIdAndDelete(id)

    if (!deletedCourse) {
      return res.status(404).json({ message: "Curso no encontrado" })
    }

    res.status(200).json({ message: "Curso eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el curso", error })
  }
}

export async function getExternalCourses(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query

    const response = await axios.get(EXTERNAL_API_URL, {
      headers: {
        "x-api-key": API_KEY,
      },
      params: {
        page,
        limit,
      },
    })

    if (!response.data.success) {
      return res.status(400).json({
        message: response.data.message || "Error en la API externa",
      })
    }

    res.status(200).json(response.data)
  } catch (error) {
    console.error("Error fetching external courses:", error)
    res.status(500).json({
      message: "Error al obtener cursos de la API externa",
      error: error.message,
    })
  }
}

export async function syncCourses(req, res) {
  try {
    console.log("🚀 Iniciando sincronización masiva de cursos...")

    let allExternalCourses = []
    let currentPage = 1
    let totalPages = 1

    // Obtener todos los cursos de la API externa
    do {
      console.log(`📥 Obteniendo página ${currentPage} de cursos externos...`)

      const response = await axios.get(EXTERNAL_API_URL, {
        headers: {
          "x-api-key": API_KEY,
        },
        params: {
          page: currentPage,
          limit: 50,
        },
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Error en la API externa")
      }

      allExternalCourses = allExternalCourses.concat(response.data.data)
      totalPages = response.data.pagination.totalPages
      currentPage++

      console.log(`✅ Página ${currentPage - 1} obtenida. Total acumulado: ${allExternalCourses.length}`)
    } while (currentPage <= totalPages)

    console.log(`📊 Total de cursos externos obtenidos: ${allExternalCourses.length}`)

    if (!Array.isArray(allExternalCourses)) {
      return res.status(400).json({
        message: "Formato de datos inválido de la API externa",
      })
    }

    // Análisis de duplicados en la API externa
    const uniqueCodes = new Set()
    const uniqueExternalIds = new Set()
    const duplicateAnalysis = {
      duplicatesByCode: [],
      duplicatesByExternalId: [],
      totalUniqueCodes: 0,
      totalUniqueExternalIds: 0,
    }

    allExternalCourses.forEach((course, index) => {
      if (course.code) {
        if (uniqueCodes.has(course.code)) {
          duplicateAnalysis.duplicatesByCode.push({
            code: course.code,
            index: index + 1,
            externalId: course._id,
          })
        } else {
          uniqueCodes.add(course.code)
        }
      }

      if (course._id) {
        if (uniqueExternalIds.has(course._id)) {
          duplicateAnalysis.duplicatesByExternalId.push({
            externalId: course._id,
            index: index + 1,
            code: course.code,
          })
        } else {
          uniqueExternalIds.add(course._id)
        }
      }
    })

    duplicateAnalysis.totalUniqueCodes = uniqueCodes.size
    duplicateAnalysis.totalUniqueExternalIds = uniqueExternalIds.size

    console.log(`🔍 Análisis de duplicados:`)
    console.log(`   - Códigos únicos: ${duplicateAnalysis.totalUniqueCodes}`)
    console.log(`   - IDs externos únicos: ${duplicateAnalysis.totalUniqueExternalIds}`)
    console.log(`   - Duplicados por código: ${duplicateAnalysis.duplicatesByCode.length}`)
    console.log(`   - Duplicados por ID externo: ${duplicateAnalysis.duplicatesByExternalId.length}`)

    let created = 0
    let updated = 0
    let skipped = 0
    let errors = 0
    let duplicatesSkipped = 0
    const errorDetails = []
    const validationErrors = []
    const processedCodes = new Set()
    const processedExternalIds = new Set()

    console.log("🔄 Iniciando procesamiento de cursos...")

    for (const [index, externalCourse] of allExternalCourses.entries()) {
      try {
        console.log(
          `📝 Procesando curso ${index + 1}/${allExternalCourses.length}: ${externalCourse.code || "Sin código"}`,
        )

        // Validar datos requeridos
        if (!externalCourse.code) {
          console.warn(`⚠️ Curso sin código en índice ${index + 1}, saltando...`)
          validationErrors.push(`Curso en índice ${index + 1}: Sin código`)
          errors++
          continue
        }

        if (!externalCourse.fk_programs) {
          console.warn(`⚠️ Curso ${externalCourse.code}: Sin programa asociado, saltando...`)
          validationErrors.push(`Curso ${externalCourse.code}: Sin programa asociado`)
          errors++
          continue
        }

        // Verificar si ya procesamos este código o ID externo en esta sesión
        if (processedCodes.has(externalCourse.code) || processedExternalIds.has(externalCourse._id)) {
          console.log(`🔄 Duplicado en API externa saltado: ${externalCourse.code}`)
          duplicatesSkipped++
          continue
        }

        // Marcar como procesado
        processedCodes.add(externalCourse.code)
        processedExternalIds.add(externalCourse._id)

        const courseData = {
          code: externalCourse.code,
          offer_type: externalCourse.offer_type || "ABIERTA",
          start_date: externalCourse.start_date ? new Date(externalCourse.start_date) : new Date(),
          end_date: externalCourse.end_date ? new Date(externalCourse.end_date) : new Date(),
          internship_start_date: externalCourse.internship_start_date
            ? new Date(externalCourse.internship_start_date)
            : null,
          terms_expiry_date: externalCourse.terms_expiry_date ? new Date(externalCourse.terms_expiry_date) : null,
          area: externalCourse.area || "Sin área",
          fk_coordination: externalCourse.fk_coordination || "Sin coordinación",
          fk_itinerary: externalCourse.fk_itinerary || "Sin itinerario",
          fk_programs: externalCourse.fk_programs,
          course_status: externalCourse.course_status || "EN EJECUCION",
          quarter: externalCourse.quarter || "0",
          status: externalCourse.status !== false,
          externalId: externalCourse._id,
        }

        // Buscar curso existente
        const existingCourse = await Course.findOne({
          $or: [{ code: courseData.code }, { externalId: courseData.externalId }],
        })

        if (existingCourse) {
          console.log(`🔄 Curso existente encontrado: ${courseData.code}`)

          // Verificar si hay cambios
          const hasChanges =
            existingCourse.offer_type !== courseData.offer_type ||
            existingCourse.start_date.getTime() !== courseData.start_date.getTime() ||
            existingCourse.end_date.getTime() !== courseData.end_date.getTime() ||
            existingCourse.area !== courseData.area ||
            existingCourse.fk_coordination !== courseData.fk_coordination ||
            existingCourse.fk_itinerary !== courseData.fk_itinerary ||
            existingCourse.fk_programs !== courseData.fk_programs ||
            existingCourse.course_status !== courseData.course_status ||
            existingCourse.status !== courseData.status

          if (hasChanges) {
            console.log(`📝 Actualizando curso: ${courseData.code}`)
            await Course.findByIdAndUpdate(existingCourse._id, courseData, { runValidators: true })
            updated++
          } else {
            console.log(`⏭️ Sin cambios en curso: ${courseData.code}`)
            skipped++
          }
        } else {
          console.log(`➕ Creando nuevo curso: ${courseData.code}`)
          const newCourse = new Course(courseData)
          await newCourse.save()
          created++
          console.log(`✅ Curso creado exitosamente: ${courseData.code}`)
        }
      } catch (error) {
        console.error(`❌ Error procesando curso ${externalCourse.code || "sin código"}:`, error.message)
        errors++
        errorDetails.push({
          course: externalCourse.code || `Índice ${index + 1}`,
          error: error.message,
          details: error.name === "ValidationError" ? Object.keys(error.errors).join(", ") : "Error desconocido",
        })
      }
    }

    // Verificar total en base de datos después de la sincronización
    const totalInDB = await Course.countDocuments()
    console.log(`📊 Total de cursos en base de datos después de sincronización: ${totalInDB}`)

    const actualProcessed = created + updated + skipped
    const totalSkipped = duplicatesSkipped + skipped

    console.log(`🎉 Sincronización completada:`)
    console.log(`   - Total de registros en API externa: ${allExternalCourses.length}`)
    console.log(`   - Registros únicos procesados: ${actualProcessed}`)
    console.log(`   - Duplicados en API externa saltados: ${duplicatesSkipped}`)
    console.log(`   - Registros sin cambios: ${skipped}`)
    console.log(`   - Total en base de datos: ${totalInDB}`)

    const response = {
      message: "Sincronización completada",
      summary: {
        total: allExternalCourses.length,
        created,
        updated,
        skipped,
        errors,
        totalInDatabase: totalInDB,
        duplicatesSkipped,
        actualProcessed,
      },
      duplicateAnalysis,
      errorDetails: errorDetails.length > 0 ? errorDetails.slice(0, 10) : undefined,
      validationErrors: validationErrors.length > 0 ? validationErrors.slice(0, 10) : undefined,
      discrepancy: {
        externalTotal: allExternalCourses.length,
        localTotal: totalInDB,
        difference: allExternalCourses.length - totalInDB,
        duplicatesInExternal: duplicatesSkipped,
        explanation: `La API externa tiene ${allExternalCourses.length} registros, pero ${duplicatesSkipped} son duplicados. Los ${totalInDB} registros únicos están correctamente sincronizados en la base de datos local.`,
      },
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("💥 Error en sincronización masiva:", error)
    res.status(500).json({
      message: "Error en la sincronización masiva",
      error: error.message,
    })
  }
}

export async function checkConnectivity(req, res) {
  try {
    const results = {
      external: false,
      local: true,
      timestamp: new Date().toISOString(),
      errors: [],
    }

    try {
      const response = await axios.get(EXTERNAL_API_URL, {
        headers: {
          "x-api-key": API_KEY,
        },
        timeout: 5000,
      })

      results.external = response.status === 200
      results.externalData = {
        status: response.status,
        recordCount: Array.isArray(response.data.data) ? response.data.data.length : 0,
      }
    } catch (error) {
      results.errors.push(`API Externa: ${error.message}`)
    }

    try {
      const count = await Course.countDocuments()
      results.localData = {
        recordCount: count,
      }
    } catch (error) {
      results.local = false
      results.errors.push(`Base de datos local: ${error.message}`)
    }

    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({
      message: "Error verificando conectividad",
      error: error.message,
    })
  }
}
