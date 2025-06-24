// // // import Course from "../models/course.js"
// // // import axios from "axios"

// // // // Configuración de la API externa
// // // const EXTERNAL_API_URL = "https://sara-api-ingdanielbs-projects.vercel.app/api/v1/courses"
// // // const API_KEY = "sara_d32775a2ea8a39a3.a14bb968e21a6be6821d19f2764945338ba182b972aff43732b0c7c8314d343a"

// // // // Obtener todos los cursos
// // // export async function getCourses(req, res) {
// // //   try {
// // //     const courses = await Course.find()
// // //     res.status(200).json(courses)
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Error al cargar los cursos", error })
// // //   }
// // // }

// // // // Obtener curso por ID
// // // export async function getCourseById(req, res) {
// // //   try {
// // //     const { id } = req.params
// // //     const course = await Course.findById(id)

// // //     if (!course) {
// // //       return res.status(404).json({ message: "Curso no encontrado" })
// // //     }

// // //     res.status(200).json(course)
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Error al obtener el curso", error })
// // //   }
// // // }

// // // // Crear nuevo curso
// // // export async function createCourse(req, res) {
// // //   try {
// // //     const courseData = req.body
// // //     const newCourse = new Course(courseData)
// // //     const savedCourse = await newCourse.save()

// // //     res.status(201).json(savedCourse)
// // //   } catch (error) {
// // //     if (error.code === 11000) {
// // //       return res.status(400).json({
// // //         message: "Ya existe un curso con ese código",
// // //       })
// // //     }
// // //     res.status(500).json({ message: "Error al crear el curso", error })
// // //   }
// // // }

// // // // Actualizar curso
// // // export async function updateCourse(req, res) {
// // //   try {
// // //     const { id } = req.params
// // //     const updateData = req.body

// // //     const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

// // //     if (!updatedCourse) {
// // //       return res.status(404).json({ message: "Curso no encontrado" })
// // //     }

// // //     res.status(200).json(updatedCourse)
// // //   } catch (error) {
// // //     if (error.code === 11000) {
// // //       return res.status(400).json({
// // //         message: "Ya existe un curso con ese código",
// // //       })
// // //     }
// // //     res.status(500).json({ message: "Error al actualizar el curso", error })
// // //   }
// // // }

// // // // Eliminar curso
// // // export async function deleteCourse(req, res) {
// // //   try {
// // //     const { id } = req.params
// // //     const deletedCourse = await Course.findByIdAndDelete(id)

// // //     if (!deletedCourse) {
// // //       return res.status(404).json({ message: "Curso no encontrado" })
// // //     }

// // //     res.status(200).json({ message: "Curso eliminado correctamente" })
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Error al eliminar el curso", error })
// // //   }
// // // }

// // // // Obtener cursos desde API externa
// // // export async function getExternalCourses(req, res) {
// // //   try {
// // //     const { page = 1, limit = 10 } = req.query

// // //     const response = await axios.get(EXTERNAL_API_URL, {
// // //       headers: {
// // //         "x-api-key": API_KEY,
// // //       },
// // //       params: {
// // //         page,
// // //         limit,
// // //       },
// // //     })

// // //     // La API externa devuelve { success, message, data, pagination }
// // //     if (!response.data.success) {
// // //       return res.status(400).json({
// // //         message: response.data.message || "Error en la API externa",
// // //       })
// // //     }

// // //     res.status(200).json(response.data)
// // //   } catch (error) {
// // //     console.error("Error fetching external courses:", error)
// // //     res.status(500).json({
// // //       message: "Error al obtener cursos de la API externa",
// // //       error: error.message,
// // //     })
// // //   }
// // // }

// // // // Sincronización masiva de cursos
// // // export async function syncCourses(req, res) {
// // //   try {
// // //     let allExternalCourses = []
// // //     let currentPage = 1
// // //     let totalPages = 1

// // //     // Obtener todos los cursos paginados
// // //     do {
// // //       const response = await axios.get(EXTERNAL_API_URL, {
// // //         headers: {
// // //           "x-api-key": API_KEY,
// // //         },
// // //         params: {
// // //           page: currentPage,
// // //           limit: 50, // Obtener más registros por página para eficiencia
// // //         },
// // //       })

// // //       if (!response.data.success) {
// // //         throw new Error(response.data.message || "Error en la API externa")
// // //       }

// // //       allExternalCourses = allExternalCourses.concat(response.data.data)
// // //       totalPages = response.data.pagination.totalPages
// // //       currentPage++
// // //     } while (currentPage <= totalPages)

// // //     if (!Array.isArray(allExternalCourses)) {
// // //       return res.status(400).json({
// // //         message: "Formato de datos inválido de la API externa",
// // //       })
// // //     }

// // //     let created = 0
// // //     let updated = 0
// // //     let skipped = 0
// // //     let errors = 0
// // //     const errorDetails = []

// // //     for (const externalCourse of allExternalCourses) {
// // //       try {
// // //         // Mapear datos de la API externa al modelo local
// // //         const courseData = {
// // //           code: externalCourse.code,
// // //           offer_type: externalCourse.offer_type,
// // //           start_date: new Date(externalCourse.start_date),
// // //           end_date: new Date(externalCourse.end_date),
// // //           internship_start_date: externalCourse.internship_start_date
// // //             ? new Date(externalCourse.internship_start_date)
// // //             : null,
// // //           terms_expiry_date: externalCourse.terms_expiry_date ? new Date(externalCourse.terms_expiry_date) : null,
// // //           area: externalCourse.area,
// // //           fk_coordination: externalCourse.fk_coordination,
// // //           fk_itinerary: externalCourse.fk_itinerary,
// // //           fk_programs: externalCourse.fk_programs,
// // //           course_status: externalCourse.course_status,
// // //           quarter: externalCourse.quarter || "0",
// // //           status: externalCourse.status,
// // //           externalId: externalCourse._id,
// // //         }

// // //         // Buscar si ya existe por código o ID externo
// // //         const existingCourse = await Course.findOne({
// // //           $or: [{ code: courseData.code }, { externalId: courseData.externalId }],
// // //         })

// // //         if (existingCourse) {
// // //           // Verificar si hay cambios
// // //           const hasChanges =
// // //             existingCourse.offer_type !== courseData.offer_type ||
// // //             existingCourse.start_date.getTime() !== courseData.start_date.getTime() ||
// // //             existingCourse.end_date.getTime() !== courseData.end_date.getTime() ||
// // //             existingCourse.area !== courseData.area ||
// // //             existingCourse.fk_coordination !== courseData.fk_coordination ||
// // //             existingCourse.fk_itinerary !== courseData.fk_itinerary ||
// // //             existingCourse.fk_programs !== courseData.fk_programs ||
// // //             existingCourse.course_status !== courseData.course_status ||
// // //             existingCourse.status !== courseData.status

// // //           if (hasChanges) {
// // //             await Course.findByIdAndUpdate(existingCourse._id, courseData)
// // //             updated++
// // //           } else {
// // //             skipped++
// // //           }
// // //         } else {
// // //           // Crear nuevo curso
// // //           const newCourse = new Course(courseData)
// // //           await newCourse.save()
// // //           created++
// // //         }
// // //       } catch (error) {
// // //         console.error(`Error procesando curso ${externalCourse.code}:`, error)
// // //         errors++
// // //         errorDetails.push({
// // //           course: externalCourse.code,
// // //           error: error.message,
// // //         })
// // //       }
// // //     }

// // //     res.status(200).json({
// // //       message: "Sincronización completada",
// // //       summary: {
// // //         total: allExternalCourses.length,
// // //         created,
// // //         updated,
// // //         skipped,
// // //         errors,
// // //       },
// // //       errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
// // //     })
// // //   } catch (error) {
// // //     console.error("Error en sincronización masiva:", error)
// // //     res.status(500).json({
// // //       message: "Error en la sincronización masiva",
// // //       error: error.message,
// // //     })
// // //   }
// // // }

// // // // Verificar conectividad con APIs
// // // export async function checkConnectivity(req, res) {
// // //   try {
// // //     const results = {
// // //       external: false,
// // //       local: true, // Asumimos que la API local está funcionando si llegamos aquí
// // //       timestamp: new Date().toISOString(),
// // //       errors: [],
// // //     }

// // //     // Verificar API externa
// // //     try {
// // //       const response = await axios.get(EXTERNAL_API_URL, {
// // //         headers: {
// // //           "x-api-key": API_KEY,
// // //         },
// // //         timeout: 5000,
// // //       })

// // //       results.external = response.status === 200
// // //       results.externalData = {
// // //         status: response.status,
// // //         recordCount: Array.isArray(response.data.data) ? response.data.data.length : 0,
// // //       }
// // //     } catch (error) {
// // //       results.errors.push(`API Externa: ${error.message}`)
// // //     }

// // //     // Verificar base de datos local
// // //     try {
// // //       const count = await Course.countDocuments()
// // //       results.localData = {
// // //         recordCount: count,
// // //       }
// // //     } catch (error) {
// // //       results.local = false
// // //       results.errors.push(`Base de datos local: ${error.message}`)
// // //     }

// // //     res.status(200).json(results)
// // //   } catch (error) {
// // //     res.status(500).json({
// // //       message: "Error verificando conectividad",
// // //       error: error.message,
// // //     })
// // //   }
// // // }
// // import Course from "../models/course.js"
// // import { successResponse, errorResponse } from "../utils/responseHandler.js"
// // import { Op } from "sequelize"

// // // Configuración de la API externa
// // const EXTERNAL_API_CONFIG = {
// //   baseURL: "https://sara-api-ingdanielbs-projects.vercel.app/api/v1",
// //   headers: {
// //     "x-api-key": "sara_d32775a2ea8a39a3.a14bb968e21a6be6821d19f2764945338ba182b972aff43732b0c7c8314d343a",
// //   },
// // }

// // // Obtener todos los cursos
// // export const getCourses = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10, search } = req.query
// //     const offset = (page - 1) * limit

// //     let whereClause = {}
// //     if (search) {
// //       whereClause = {
// //         [Op.or]: [
// //           { code: { [Op.iLike]: `%${search}%` } },
// //           { area: { [Op.iLike]: `%${search}%` } },
// //           { fk_programs: { [Op.iLike]: `%${search}%` } },
// //         ],
// //       }
// //     }

// //     const { count, rows } = await Course.findAndCountAll({
// //       where: whereClause,
// //       limit: Number.parseInt(limit),
// //       offset: Number.parseInt(offset),
// //       order: [["createdAt", "DESC"]],
// //     })

// //     const totalPages = Math.ceil(count / limit)

// //     return successResponse(res, "Cursos obtenidos exitosamente", {
// //       courses: rows,
// //       pagination: {
// //         currentPage: Number.parseInt(page),
// //         totalPages,
// //         totalItems: count,
// //         itemsPerPage: Number.parseInt(limit),
// //         hasNextPage: page < totalPages,
// //         hasPrevPage: page > 1,
// //       },
// //     })
// //   } catch (error) {
// //     console.error("Error al obtener cursos:", error)
// //     return errorResponse(res, "Error interno del servidor", 500)
// //   }
// // }

// // // Obtener curso por ID
// // export const getCourseById = async (req, res) => {
// //   try {
// //     const { id } = req.params
// //     const course = await Course.findByPk(id)

// //     if (!course) {
// //       return errorResponse(res, "Curso no encontrado", 404)
// //     }

// //     return successResponse(res, "Curso obtenido exitosamente", course)
// //   } catch (error) {
// //     console.error("Error al obtener curso:", error)
// //     return errorResponse(res, "Error interno del servidor", 500)
// //   }
// // }

// // // Crear nuevo curso
// // export const createCourse = async (req, res) => {
// //   try {
// //     const course = await Course.create(req.body)
// //     return successResponse(res, "Curso creado exitosamente", course, 201)
// //   } catch (error) {
// //     console.error("Error al crear curso:", error)
// //     return errorResponse(res, "Error interno del servidor", 500)
// //   }
// // }

// // // Actualizar curso
// // export const updateCourse = async (req, res) => {
// //   try {
// //     const { id } = req.params
// //     const [updatedRowsCount] = await Course.update(req.body, {
// //       where: { id },
// //     })

// //     if (updatedRowsCount === 0) {
// //       return errorResponse(res, "Curso no encontrado", 404)
// //     }

// //     const updatedCourse = await Course.findByPk(id)
// //     return successResponse(res, "Curso actualizado exitosamente", updatedCourse)
// //   } catch (error) {
// //     console.error("Error al actualizar curso:", error)
// //     return errorResponse(res, "Error interno del servidor", 500)
// //   }
// // }

// // // Eliminar curso
// // export const deleteCourse = async (req, res) => {
// //   try {
// //     const { id } = req.params
// //     const deletedRowsCount = await Course.destroy({
// //       where: { id },
// //     })

// //     if (deletedRowsCount === 0) {
// //       return errorResponse(res, "Curso no encontrado", 404)
// //     }

// //     return successResponse(res, "Curso eliminado exitosamente")
// //   } catch (error) {
// //     console.error("Error al eliminar curso:", error)
// //     return errorResponse(res, "Error interno del servidor", 500)
// //   }
// // }

// // // Obtener cursos desde API externa
// // export const getExternalCourses = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10 } = req.query

// //     const response = await fetch(`${EXTERNAL_API_CONFIG.baseURL}/courses?page=${page}&limit=${limit}`, {
// //       method: "GET",
// //       headers: EXTERNAL_API_CONFIG.headers,
// //     })

// //     if (!response.ok) {
// //       throw new Error(`HTTP error! status: ${response.status}`)
// //     }

// //     const data = await response.json()
// //     return successResponse(res, "Cursos externos obtenidos exitosamente", data)
// //   } catch (error) {
// //     console.error("Error al obtener cursos externos:", error)
// //     return errorResponse(res, "Error al conectar con la API externa", 500)
// //   }
// // }

// // // Sincronización masiva de cursos
// // export const syncCourses = async (req, res) => {
// //   try {
// //     let allCourses = []
// //     let currentPage = 1
// //     let totalPages = 1

// //     // Obtener todos los cursos de la API externa
// //     do {
// //       const response = await fetch(`${EXTERNAL_API_CONFIG.baseURL}/courses?page=${currentPage}&limit=50`, {
// //         method: "GET",
// //         headers: EXTERNAL_API_CONFIG.headers,
// //       })

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`)
// //       }

// //       const data = await response.json()
// //       allCourses = [...allCourses, ...data.data]
// //       totalPages = data.pagination.totalPages
// //       currentPage++
// //     } while (currentPage <= totalPages)

// //     // Mapear y sincronizar cursos
// //     const mappedCourses = allCourses.map((course) => ({
// //       external_id: course._id,
// //       code: course.code,
// //       offer_type: course.offer_type,
// //       start_date: course.start_date,
// //       end_date: course.end_date,
// //       internship_start_date: course.internship_start_date,
// //       terms_expiry_date: course.terms_expiry_date,
// //       area: course.area,
// //       fk_coordination: course.fk_coordination,
// //       fk_itinerary: course.fk_itinerary,
// //       fk_programs: course.fk_programs,
// //       course_status: course.course_status,
// //       quarter: course.quarter,
// //       status: course.status,
// //       internship_tart_date: course.internship_tart_date,
// //     }))

// //     // Usar upsert para crear o actualizar
// //     const results = await Promise.allSettled(
// //       mappedCourses.map(async (courseData) => {
// //         const [course, created] = await Course.upsert(courseData, {
// //           conflictFields: ["external_id"],
// //         })
// //         return { course, created }
// //       }),
// //     )

// //     const successful = results.filter((r) => r.status === "fulfilled").length
// //     const failed = results.filter((r) => r.status === "rejected").length

// //     return successResponse(res, "Sincronización completada", {
// //       total: allCourses.length,
// //       successful,
// //       failed,
// //       details: `${successful} cursos sincronizados exitosamente, ${failed} fallaron`,
// //     })
// //   } catch (error) {
// //     console.error("Error en sincronización masiva:", error)
// //     return errorResponse(res, "Error en la sincronización masiva", 500)
// //   }
// // }

// // // Verificar conectividad con API externa
// // export const checkConnectivity = async (req, res) => {
// //   try {
// //     const response = await fetch(`${EXTERNAL_API_CONFIG.baseURL}/courses?page=1&limit=1`, {
// //       method: "GET",
// //       headers: EXTERNAL_API_CONFIG.headers,
// //     })

// //     if (!response.ok) {
// //       throw new Error(`HTTP error! status: ${response.status}`)
// //     }

// //     return successResponse(res, "Conectividad exitosa", {
// //       status: "connected",
// //       timestamp: new Date().toISOString(),
// //     })
// //   } catch (error) {
// //     console.error("Error de conectividad:", error)
// //     return errorResponse(res, "Error de conectividad con API externa", 500)
// //   }
// // }
// import Course from "../models/course.js"
// import axios from "axios"

// const EXTERNAL_API_URL = "https://sara-api-ingdanielbs-projects.vercel.app/api/v1/courses"
// const API_KEY = "sara_d32775a2ea8a39a3.a14bb968e21a6be6821d19f2764945338ba182b972aff43732b0c7c8314d343a"

// export async function getCourses(req, res) {
//   try {
//     const courses = await Course.find()
//     res.status(200).json(courses)
//   } catch (error) {
//     res.status(500).json({ message: "Error al cargar los cursos", error })
//   }
// }

// export async function getCourseById(req, res) {
//   try {
//     const { id } = req.params
//     const course = await Course.findById(id)

//     if (!course) {
//       return res.status(404).json({ message: "Curso no encontrado" })
//     }

//     res.status(200).json(course)
//   } catch (error) {
//     res.status(500).json({ message: "Error al obtener el curso", error })
//   }
// }

// export async function createCourse(req, res) {
//   try {
//     const courseData = req.body
//     const newCourse = new Course(courseData)
//     const savedCourse = await newCourse.save()

//     res.status(201).json(savedCourse)
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Ya existe un curso con ese código",
//       })
//     }
//     res.status(500).json({ message: "Error al crear el curso", error })
//   }
// }

// export async function updateCourse(req, res) {
//   try {
//     const { id } = req.params
//     const updateData = req.body

//     const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

//     if (!updatedCourse) {
//       return res.status(404).json({ message: "Curso no encontrado" })
//     }

//     res.status(200).json(updatedCourse)
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Ya existe un curso con ese código",
//       })
//     }
//     res.status(500).json({ message: "Error al actualizar el curso", error })
//   }
// }

// export async function deleteCourse(req, res) {
//   try {
//     const { id } = req.params
//     const deletedCourse = await Course.findByIdAndDelete(id)

//     if (!deletedCourse) {
//       return res.status(404).json({ message: "Curso no encontrado" })
//     }

//     res.status(200).json({ message: "Curso eliminado correctamente" })
//   } catch (error) {
//     res.status(500).json({ message: "Error al eliminar el curso", error })
//   }
// }

// export async function getExternalCourses(req, res) {
//   try {
//     const { page = 1, limit = 10 } = req.query

//     const response = await axios.get(EXTERNAL_API_URL, {
//       headers: {
//         "x-api-key": API_KEY,
//       },
//       params: {
//         page,
//         limit,
//       },
//     })

//     if (!response.data.success) {
//       return res.status(400).json({
//         message: response.data.message || "Error en la API externa",
//       })
//     }

//     res.status(200).json(response.data)
//   } catch (error) {
//     console.error("Error fetching external courses:", error)
//     res.status(500).json({
//       message: "Error al obtener cursos de la API externa",
//       error: error.message,
//     })
//   }
// }

// export async function syncCourses(req, res) {
//   try {
//     let allExternalCourses = []
//     let currentPage = 1
//     let totalPages = 1

//     do {
//       const response = await axios.get(EXTERNAL_API_URL, {
//         headers: {
//           "x-api-key": API_KEY,
//         },
//         params: {
//           page: currentPage,
//           limit: 50,
//         },
//       })

//       if (!response.data.success) {
//         throw new Error(response.data.message || "Error en la API externa")
//       }

//       allExternalCourses = allExternalCourses.concat(response.data.data)
//       totalPages = response.data.pagination.totalPages
//       currentPage++
//     } while (currentPage <= totalPages)

//     if (!Array.isArray(allExternalCourses)) {
//       return res.status(400).json({
//         message: "Formato de datos inválido de la API externa",
//       })
//     }

//     let created = 0
//     let updated = 0
//     let skipped = 0
//     let errors = 0
//     const errorDetails = []

//     for (const externalCourse of allExternalCourses) {
//       try {
//         const courseData = {
//           code: externalCourse.code,
//           offer_type: externalCourse.offer_type,
//           start_date: new Date(externalCourse.start_date),
//           end_date: new Date(externalCourse.end_date),
//           internship_start_date: externalCourse.internship_start_date
//             ? new Date(externalCourse.internship_start_date)
//             : null,
//           terms_expiry_date: externalCourse.terms_expiry_date ? new Date(externalCourse.terms_expiry_date) : null,
//           area: externalCourse.area,
//           fk_coordination: externalCourse.fk_coordination,
//           fk_itinerary: externalCourse.fk_itinerary,
//           fk_programs: externalCourse.fk_programs,
//           course_status: externalCourse.course_status,
//           quarter: externalCourse.quarter || "0",
//           status: externalCourse.status,
//           externalId: externalCourse._id,
//         }

//         const existingCourse = await Course.findOne({
//           $or: [{ code: courseData.code }, { externalId: courseData.externalId }],
//         })

//         if (existingCourse) {
//           const hasChanges =
//             existingCourse.offer_type !== courseData.offer_type ||
//             existingCourse.start_date.getTime() !== courseData.start_date.getTime() ||
//             existingCourse.end_date.getTime() !== courseData.end_date.getTime() ||
//             existingCourse.area !== courseData.area ||
//             existingCourse.fk_coordination !== courseData.fk_coordination ||
//             existingCourse.fk_itinerary !== courseData.fk_itinerary ||
//             existingCourse.fk_programs !== courseData.fk_programs ||
//             existingCourse.course_status !== courseData.course_status ||
//             existingCourse.status !== courseData.status

//           if (hasChanges) {
//             await Course.findByIdAndUpdate(existingCourse._id, courseData)
//             updated++
//           } else {
//             skipped++
//           }
//         } else {
//           const newCourse = new Course(courseData)
//           await newCourse.save()
//           created++
//         }
//       } catch (error) {
//         console.error(`Error procesando curso ${externalCourse.code}:`, error)
//         errors++
//         errorDetails.push({
//           course: externalCourse.code,
//           error: error.message,
//         })
//       }
//     }

//     res.status(200).json({
//       message: "Sincronización completada",
//       summary: {
//         total: allExternalCourses.length,
//         created,
//         updated,
//         skipped,
//         errors,
//       },
//       errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
//     })
//   } catch (error) {
//     console.error("Error en sincronización masiva:", error)
//     res.status(500).json({
//       message: "Error en la sincronización masiva",
//       error: error.message,
//     })
//   }
// }

// export async function checkConnectivity(req, res) {
//   try {
//     const results = {
//       external: false,
//       local: true,
//       timestamp: new Date().toISOString(),
//       errors: [],
//     }

//     try {
//       const response = await axios.get(EXTERNAL_API_URL, {
//         headers: {
//           "x-api-key": API_KEY,
//         },
//         timeout: 5000,
//       })

//       results.external = response.status === 200
//       results.externalData = {
//         status: response.status,
//         recordCount: Array.isArray(response.data.data) ? response.data.data.length : 0,
//       }
//     } catch (error) {
//       results.errors.push(`API Externa: ${error.message}`)
//     }

//     try {
//       const count = await Course.countDocuments()
//       results.localData = {
//         recordCount: count,
//       }
//     } catch (error) {
//       results.local = false
//       results.errors.push(`Base de datos local: ${error.message}`)
//     }

//     res.status(200).json(results)
//   } catch (error) {
//     res.status(500).json({
//       message: "Error verificando conectividad",
//       error: error.message,
//     })
//   }
// }
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
    let allExternalCourses = []
    let currentPage = 1
    let totalPages = 1

    do {
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
    } while (currentPage <= totalPages)

    if (!Array.isArray(allExternalCourses)) {
      return res.status(400).json({
        message: "Formato de datos inválido de la API externa",
      })
    }

    let created = 0
    let updated = 0
    let skipped = 0
    let errors = 0
    const errorDetails = []

    for (const externalCourse of allExternalCourses) {
      try {
        const courseData = {
          code: externalCourse.code,
          offer_type: externalCourse.offer_type,
          start_date: new Date(externalCourse.start_date),
          end_date: new Date(externalCourse.end_date),
          internship_start_date: externalCourse.internship_start_date
            ? new Date(externalCourse.internship_start_date)
            : null,
          terms_expiry_date: externalCourse.terms_expiry_date ? new Date(externalCourse.terms_expiry_date) : null,
          area: externalCourse.area,
          fk_coordination: externalCourse.fk_coordination,
          fk_itinerary: externalCourse.fk_itinerary,
          fk_programs: externalCourse.fk_programs,
          course_status: externalCourse.course_status,
          quarter: externalCourse.quarter || "0",
          status: externalCourse.status,
          externalId: externalCourse._id,
        }

        const existingCourse = await Course.findOne({
          $or: [{ code: courseData.code }, { externalId: courseData.externalId }],
        })

        if (existingCourse) {
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
            await Course.findByIdAndUpdate(existingCourse._id, courseData)
            updated++
          } else {
            skipped++
          }
        } else {
          const newCourse = new Course(courseData)
          await newCourse.save()
          created++
        }
      } catch (error) {
        console.error(`Error procesando curso ${externalCourse.code}:`, error)
        errors++
        errorDetails.push({
          course: externalCourse.code,
          error: error.message,
        })
      }
    }

    res.status(200).json({
      message: "Sincronización completada",
      summary: {
        total: allExternalCourses.length,
        created,
        updated,
        skipped,
        errors,
      },
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
    })
  } catch (error) {
    console.error("Error en sincronización masiva:", error)
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
