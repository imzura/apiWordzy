// #inicio modulos dickson
import User from "../models/user.js"
import Role from "../models/role.js"
import ApprenticeProgress from "../models/apprenticeProgress.js" // IMPORTANTE: Importar el nuevo modelo
import mongoose from "mongoose" // Importar mongoose para usar mongoose.model('Course')

// --- Funciones helper (sin cambios) ---
const findRoleByName = async (roleName) => {
  try {
    const role = await Role.findOne({
      name: roleName,
      status: true,
    })
    return role
  } catch (error) {
    console.error(`Error buscando rol ${roleName}:`, error)
    return null
  }
}

const validateUserRole = async (tipoUsuario, roleId) => {
  try {
    const role = await Role.findById(roleId)
    if (!role) return false

    // Validar que el rol coincida con el tipo de usuario
    if (tipoUsuario === "aprendiz" && role.name !== "Aprendiz") {
      return false
    }
    if (tipoUsuario === "instructor" && role.name !== "Instructor") {
      return false
    }
    if (tipoUsuario === "administrador" && role.name !== "Administrador") {
      // NUEVO: Validar rol de administrador
      return false
    }

    return true
  } catch (error) {
    console.error("Error validando rol de usuario:", error)
    return false
  }
}

// CAMBIO: Se actualiza la validación de datos de aprendiz
const validateApprenticeData = (userData) => {
  const errors = []
  if (userData.tipoUsuario === "aprendiz") {
    if (!userData.ficha || !Array.isArray(userData.ficha) || userData.ficha.length === 0) {
      errors.push("Los aprendices deben tener al menos una ficha asignada")
    }
    if (!userData.programa || userData.programa.trim().length < 2) {
      errors.push("Los aprendices deben tener un programa asignado")
    }
  }
  return errors
}

// --- getAllUsers (sin cambios significativos, solo limpieza) ---
export const getAllUsers = async (req, res) => {
  try {
    console.log("=== OBTENIENDO TODOS LOS USUARIOS ===")

    const { tipoUsuario, estado, programa, ficha } = req.query
    const filter = {}

    if (tipoUsuario) {
      filter.tipoUsuario = tipoUsuario
      console.log(`Filtrando por tipo de usuario: ${tipoUsuario}`)
    }
    if (estado) {
      filter.estado = estado
      console.log(`Filtrando por estado: ${estado}`)
    }
    if (programa && tipoUsuario === "aprendiz") {
      filter.programa = { $regex: programa, $options: "i" }
      console.log(`Filtrando por programa: ${programa}`)
    }
    if (ficha && tipoUsuario === "aprendiz") {
      filter.ficha = { $in: [Number.parseInt(ficha)] }
      console.log(`Filtrando por ficha: ${ficha}`)
    }

    let query = User.find(filter).populate("role", "name").sort({ createdAt: -1 })

    // Agregar populate para fichas si se consultan instructores
    if (!tipoUsuario || tipoUsuario === "instructor") {
      query = query.populate({
        path: "fichas",
        select:
          "code area fk_programs course_status offer_type start_date end_date status fk_coordination fk_itinerary quarter",
        match: { status: true }, // Solo fichas activas
      })
    }

    const users = await query
    const cleanUsers = users.map((user) => user.toCleanJSON())

    console.log(`Se encontraron ${cleanUsers.length} usuarios`)
    res.status(200).json(cleanUsers)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    })
  }
}

// CAMBIO: getUserById ahora calcula el progreso dinámicamente
export const getUserById = async (req, res) => {
  try {
    console.log(`=== OBTENIENDO USUARIO CON ID: ${req.params.id} ===`)

    const query = User.findById(req.params.id).populate("role", "name")

    const user = await query

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Si es un aprendiz, calculamos su progreso por niveles
    if (user.tipoUsuario === "aprendiz") {
      const progresoNiveles = []
      // Los niveles ahora son de 1 a 6
      for (let i = 1; i <= 6; i++) {
        const statsResult = await ApprenticeProgress.getProgressStatistics(user._id, i)
        const stats = statsResult[0] || { averagePercentage: 0 }
        progresoNiveles.push({
          nivel: i,
          porcentaje: Math.round(stats.averagePercentage || 0),
        })
      }
      // Adjuntamos el progreso calculado al objeto de usuario antes de enviarlo
      user.progresoNiveles = progresoNiveles
    } else if (user.tipoUsuario === "instructor") {
      // Aseguramos que las fichas del instructor se populan
      await user.populate({
        path: "fichas",
        select:
          "code area fk_programs course_status offer_type start_date end_date status fk_coordination fk_itinerary quarter",
      })
    }

    console.log(`Usuario encontrado: ${user.nombre} ${user.apellido} (${user.tipoUsuario})`)
    res.status(200).json(user.toCleanJSON())
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido" })
    }
    res.status(500).json({ message: "Error al obtener usuario", error: error.message })
  }
}

// CAMBIO: createUser ya no maneja campos de progreso
export const createUser = async (req, res) => {
  try {
    console.log("=== CREANDO NUEVO USUARIO ===")
    console.log("Datos recibidos:", req.body)

    const userData = req.body
    if (!userData.tipoUsuario || !["aprendiz", "instructor", "administrador"].includes(userData.tipoUsuario)) {
      return res.status(400).json({ message: "Tipo de usuario inválido" })
    }
    if (!userData.contraseña) userData.contraseña = userData.documento

    const existingUser = await User.findOne({ documento: userData.documento })
    if (existingUser) {
      return res.status(400).json({ message: "Ya existe un usuario con este documento" })
    }

    const cleanUserData = prepareUserData(userData)
    const apprenticeValidationErrors = validateApprenticeData(cleanUserData)
    if (apprenticeValidationErrors.length > 0) {
      return res.status(400).json({ message: "Datos de aprendiz inválidos", errors: apprenticeValidationErrors })
    }

    const user = new User(cleanUserData)
    const savedUser = await user.save()
    await savedUser.populate("role", "name")
    res.status(201).json(savedUser.toCleanJSON())
  } catch (error) {
    console.error("Error al crear usuario:", error)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Datos inválidos", errors })
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return res.status(400).json({
        message: `Ya existe un usuario con este ${field}`,
      })
    }
    res.status(500).json({ message: "Error al crear usuario", error: error.message })
  }
}

// CAMBIO: updateUser ya no maneja campos de progreso
export const updateUser = async (req, res) => {
  try {
    console.log(`=== ACTUALIZANDO USUARIO CON ID: ${req.params.id} ===`)
    console.log("Datos de actualización:", req.body)

    const { id } = req.params
    const updateData = req.body
    const currentUser = await User.findById(id)
    if (!currentUser) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    const cleanUpdateData = prepareUserData({ ...updateData, tipoUsuario: currentUser.tipoUsuario })
    const user = await User.findByIdAndUpdate(id, cleanUpdateData, { new: true, runValidators: true }).populate(
      "role",
      "name",
    )
    res.status(200).json(user.toCleanJSON())
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Datos inválidos", errors })
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido" })
    }
    res.status(500).json({ message: "Error al actualizar usuario", error: error.message })
  }
}

// --- deleteUser (sin cambios) ---
export const deleteUser = async (req, res) => {
  try {
    console.log(`=== ELIMINANDO USUARIO CON ID: ${req.params.id} ===`)

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      console.log("Usuario no encontrado para eliminar")
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    console.log(`Usuario eliminado exitosamente: ${user.nombre} ${user.apellido} (${user.tipoUsuario})`)
    res.status(200).json({ message: "Usuario eliminado exitosamente" })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido" })
    }

    res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message,
    })
  }
}

// ELIMINADO: updateProgress y updatePoints ya no pertenecen a este controlador

// --- FUNCIONES DE INSTRUCTOR (INTACTAS) ---
export const addFichaToInstructor = async (req, res) => {
  try {
    console.log(`=== AÑADIENDO FICHAS AL INSTRUCTOR CON ID: ${req.params.id} ===`)
    console.log("Datos de las fichas:", req.body)

    const { id } = req.params
    const { fichaIds } = req.body // Ahora recibe array de IDs

    if (!Array.isArray(fichaIds)) {
      return res.status(400).json({
        message: "fichaIds debe ser un array de IDs de fichas",
      })
    }

    const Course = mongoose.model("Course")
    const existingCourses = await Course.find({
      _id: { $in: fichaIds },
      status: true,
    })

    if (existingCourses.length !== fichaIds.length) {
      return res.status(400).json({
        message: "Una o más fichas no existen o están inactivas",
      })
    }

    const user = await User.findById(id)
    if (!user || user.tipoUsuario !== "instructor") {
      return res.status(404).json({ message: "Instructor no encontrado" })
    }

    const currentFichas = user.fichas.map((ficha) => ficha.toString())
    const newFichas = fichaIds.filter((fichaId) => !currentFichas.includes(fichaId.toString()))

    user.fichas.push(...newFichas)

    const updatedUser = await user.save()
    await updatedUser.populate([
      { path: "role", select: "name description status" },
      {
        path: "fichas",
        select:
          "code area fk_programs course_status offer_type start_date end_date status fk_coordination fk_itinerary quarter",
      },
    ])

    console.log(`Fichas añadidas exitosamente al instructor: ${user.nombre} ${user.apellido}`)
    res.status(200).json(updatedUser.toCleanJSON())
  } catch (error) {
    console.error("Error al añadir fichas:", error)
    res.status(500).json({ message: "Error al añadir fichas", error: error.message })
  }
}

export const removeFichaFromInstructor = async (req, res) => {
  try {
    console.log(`=== ELIMINANDO FICHA DEL INSTRUCTOR CON ID: ${req.params.id} ===`)
    console.log(`ID de la ficha: ${req.params.fichaId}`)

    const { id, fichaId } = req.params

    const user = await User.findById(id)
    if (!user || user.tipoUsuario !== "instructor") {
      return res.status(404).json({ message: "Instructor no encontrado" })
    }

    const fichaIndex = user.fichas.findIndex((ficha) => ficha.toString() === fichaId)
    if (fichaIndex === -1) {
      return res.status(404).json({ message: "Ficha no encontrada en este instructor" })
    }

    user.fichas.splice(fichaIndex, 1)

    const updatedUser = await user.save()
    await updatedUser.populate([
      { path: "role", select: "name description status" },
      {
        path: "fichas",
        select:
          "code area fk_programs course_status offer_type start_date end_date status fk_coordination fk_itinerary quarter",
      },
    ])

    console.log(`Ficha eliminada exitosamente`)
    res.status(200).json({
      message: "Ficha eliminada exitosamente",
      user: updatedUser.toCleanJSON(),
    })
  } catch (error) {
    console.error("Error al eliminar ficha:", error)
    res.status(500).json({ message: "Error al eliminar ficha", error: error.message })
  }
}

export const updateInstructorFichas = async (req, res) => {
  try {
    console.log(`=== ACTUALIZANDO FICHAS DEL INSTRUCTOR CON ID: ${req.params.id} ===`)
    console.log("Nuevas fichas:", req.body)

    const { id } = req.params
    const { fichaIds } = req.body

    if (!Array.isArray(fichaIds)) {
      return res.status(400).json({
        message: "fichaIds debe ser un array de IDs de fichas",
      })
    }

    if (fichaIds.length > 0) {
      const Course = mongoose.model("Course")
      const existingCourses = await Course.find({
        _id: { $in: fichaIds },
        status: true,
      })

      if (existingCourses.length !== fichaIds.length) {
        return res.status(400).json({
          message: "Una o más fichas no existen o están inactivas",
        })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fichas: fichaIds },
      { new: true, runValidators: true },
    ).populate([
      { path: "role", select: "name description status" },
      {
        path: "fichas",
        select:
          "code area fk_programs course_status offer_type start_date end_date status fk_coordination fk_itinerary quarter",
      },
    ])

    if (!updatedUser || updatedUser.tipoUsuario !== "instructor") {
      return res.status(404).json({ message: "Instructor no encontrado" })
    }

    console.log(`Fichas actualizadas exitosamente para: ${updatedUser.nombre} ${updatedUser.apellido}`)
    res.status(200).json(updatedUser.toCleanJSON())
  } catch (error) {
    console.error("Error al actualizar fichas:", error)
    res.status(500).json({ message: "Error al actualizar fichas", error: error.message })
  }
}

// --- OTRAS FUNCIONES (INTACTAS) ---
export const massUpdateUsers = async (req, res) => {
  try {
    console.log("=== ACTUALIZACIÓN MASIVA DE USUARIOS ===")
    console.log("Datos recibidos:", req.body)

    const { userIds, updateData } = req.body

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        message: "Se requiere un array de IDs de usuarios",
      })
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Se requieren datos para actualizar",
      })
    }

    if (updateData.tipoUsuario) {
      return res.status(400).json({
        message: "No se puede cambiar el tipo de usuario en actualización masiva",
      })
    }

    const result = await User.updateMany({ _id: { $in: userIds } }, { $set: updateData }, { runValidators: true })

    console.log(`Actualización masiva completada: ${result.modifiedCount} usuarios actualizados`)
    res.status(200).json({
      message: `${result.modifiedCount} usuarios actualizados exitosamente`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    })
  } catch (error) {
    console.error("Error en actualización masiva:", error)
    res.status(500).json({
      message: "Error en actualización masiva",
      error: error.message,
    })
  }
}

export const getUserStats = async (req, res) => {
  try {
    console.log("=== OBTENIENDO ESTADÍSTICAS DE USUARIOS ===")

    const generalStats = await User.aggregate([
      {
        $group: {
          _id: "$tipoUsuario",
          total: { $sum: 1 },
          activos: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $and: [{ $eq: ["$tipoUsuario", "aprendiz"] }, { $eq: ["$estado", "En formación"] }] },
                    { $and: [{ $eq: ["$tipoUsuario", "instructor"] }, { $eq: ["$estado", "Activo"] }] },
                    { $and: [{ $eq: ["$tipoUsuario", "administrador"] }, { $eq: ["$estado", "Activo"] }] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ])

    const apprenticeStats = await User.aggregate([
      { $match: { tipoUsuario: "aprendiz" } },
      {
        $group: {
          _id: null,
          totalAprendices: { $sum: 1 },
          enFormacion: {
            $sum: { $cond: [{ $eq: ["$estado", "En formación"] }, 1, 0] },
          },
          condicionados: {
            $sum: { $cond: [{ $eq: ["$estado", "Condicionado"] }, 1, 0] },
          },
          retirados: {
            $sum: { $cond: [{ $eq: ["$estado", "Retirado"] }, 1, 0] },
          },
          graduados: {
            $sum: { $cond: [{ $eq: ["$estado", "Graduado"] }, 1, 0] },
          },
          progresoPromedio: { $avg: "$progresoActual" },
          puntosPromedio: { $avg: "$puntos" },
          puntosTotales: { $sum: "$puntos" },
          puntosMaximos: { $max: "$puntos" },
        },
      },
    ])

    const instructorStats = await User.aggregate([
      { $match: { tipoUsuario: "instructor" } },
      {
        $group: {
          _id: null,
          totalInstructores: { $sum: 1 },
          instructoresActivos: {
            $sum: { $cond: [{ $eq: ["$estado", "Activo"] }, 1, 0] },
          },
          instructoresInactivos: {
            $sum: { $cond: [{ $eq: ["$estado", "Inactivo"] }, 1, 0] },
          },
          totalFichas: { $sum: { $size: "$fichas" } },
        },
      },
    ])

    const adminStats = await User.aggregate([
      { $match: { tipoUsuario: "administrador" } },
      {
        $group: {
          _id: null,
          totalAdministradores: { $sum: 1 },
          administradoresActivos: {
            $sum: { $cond: [{ $eq: ["$estado", "Activo"] }, 1, 0] },
          },
          administradoresInactivos: {
            $sum: { $cond: [{ $eq: ["$estado", "Inactivo"] }, 1, 0] },
          },
        },
      },
    ])

    const result = {
      general: generalStats,
      aprendices: apprenticeStats[0] || {},
      instructores: instructorStats[0] || {},
      administradores: adminStats[0] || {},
    }

    console.log("Estadísticas calculadas:", result)
    res.status(200).json(result)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ message: "Error al obtener estadísticas", error: error.message })
  }
}

// CAMBIO: Función auxiliar `prepareUserData` actualizada
const prepareUserData = (userData) => {
  const baseData = {
    tipoUsuario: userData.tipoUsuario,
    nombre: userData.nombre?.trim(),
    apellido: userData.apellido?.trim(),
    documento: userData.documento?.trim(),
    tipoDocumento: userData.tipoDocumento,
    estado: userData.estado,
    telefono: userData.telefono?.trim() || "",
    correo: userData.correo?.toLowerCase().trim(),
    contraseña: userData.contraseña,
    role: userData.role,
  }

  if (userData.tipoUsuario === "aprendiz") {
    return {
      ...baseData,
      ficha: Array.isArray(userData.ficha) ? userData.ficha : [userData.ficha],
      programa: userData.programa?.trim(),
      puntos: Number.parseInt(userData.puntos) || 0,
      progresoActual: Number.parseInt(userData.progresoActual) || 0,
    }
  } else if (userData.tipoUsuario === "instructor") {
    return {
      ...baseData,
      fichas: userData.fichas || [],
    }
  } else if (userData.tipoUsuario === "administrador") {
    return {
      ...baseData,
    }
  }

  return baseData
}
// #fin modulos dickson
