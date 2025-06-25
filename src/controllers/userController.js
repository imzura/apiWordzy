// #inicio modulos dickson
import User from "../models/user.js"
import Role from "../models/role.js"

// Función helper para buscar rol por nombre
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

// Función para validar coherencia entre tipoUsuario y rol
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

    return true
  } catch (error) {
    console.error("Error validando rol de usuario:", error)
    return false
  }
}

// Función para validar datos específicos de aprendices
const validateApprenticeData = (userData) => {
  const errors = []

  if (userData.tipoUsuario === "aprendiz") {
    // Validar ficha
    if (!userData.ficha || !Array.isArray(userData.ficha) || userData.ficha.length === 0) {
      errors.push("Los aprendices deben tener al menos una ficha asignada")
    }

    // Validar nivel
    if (userData.nivel === undefined || userData.nivel < 1 || userData.nivel > 3) {
      errors.push("Los aprendices deben tener un nivel entre 1 y 3")
    }

    // Validar programa
    if (!userData.programa || userData.programa.trim().length < 2) {
      errors.push("Los aprendices deben tener un programa asignado")
    }

    // Validar progreso niveles
    if (
      !userData.progresoNiveles ||
      !Array.isArray(userData.progresoNiveles) ||
      userData.progresoNiveles.length !== 3
    ) {
      errors.push("Los aprendices deben tener progreso para los 3 niveles")
    }

    // Validar puntos (opcional, pero si se proporciona debe ser válido)
    if (userData.puntos !== undefined) {
      if (!Number.isInteger(userData.puntos) || userData.puntos < 0) {
        errors.push("Los puntos deben ser un número entero mayor o igual a 0")
      }
    }
  }

  return errors
}

// Obtener todos los usuarios con filtro opcional por tipo
export const getAllUsers = async (req, res) => {
  try {
    console.log("=== OBTENIENDO TODOS LOS USUARIOS ===")

    const { tipoUsuario, estado, programa, ficha, nivel } = req.query

    // Construir filtro dinámico
    const filter = {}

    if (tipoUsuario && ["aprendiz", "instructor"].includes(tipoUsuario)) {
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

    if (nivel) {
      if (tipoUsuario === "aprendiz") {
        filter.nivel = Number.parseInt(nivel)
      } else if (tipoUsuario === "instructor") {
        filter["fichas.nivel"] = Number.parseInt(nivel)
      }
      console.log(`Filtrando por nivel: ${nivel}`)
    }

    const users = await User.find(filter).populate("role", "name description status").sort({ createdAt: -1 })

    // Limpiar respuesta según el tipo de usuario
    const cleanUsers = users.map((user) => {
      const userObj = user.toObject()
      if (userObj.tipoUsuario === "aprendiz") {
        delete userObj.fichas
      } else if (userObj.tipoUsuario === "instructor") {
        delete userObj.ficha
        delete userObj.nivel
        delete userObj.programa
        delete userObj.progresoActual
        delete userObj.progresoNiveles
        delete userObj.puntos
      }
      return userObj
    })

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

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    console.log(`=== OBTENIENDO USUARIO CON ID: ${req.params.id} ===`)

    const user = await User.findById(req.params.id).populate("role", "name description status")

    if (!user) {
      console.log("Usuario no encontrado")
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    console.log(`Usuario encontrado: ${user.nombre} ${user.apellido} (${user.tipoUsuario})`)
    res.status(200).json(user.toCleanJSON())
  } catch (error) {
    console.error("Error al obtener usuario:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido" })
    }

    res.status(500).json({
      message: "Error al obtener usuario",
      error: error.message,
    })
  }
}

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    console.log("=== CREANDO NUEVO USUARIO ===")
    console.log("Datos recibidos:", req.body)

    const userData = req.body

    // Validar tipo de usuario
    if (!userData.tipoUsuario || !["aprendiz", "instructor"].includes(userData.tipoUsuario)) {
      return res.status(400).json({
        message: "Tipo de usuario requerido: aprendiz o instructor",
      })
    }

    // Validar contraseña (usar documento como default si no se proporciona)
    if (!userData.contraseña && userData.documento) {
      userData.contraseña = userData.documento
    }

    if (!userData.contraseña || userData.contraseña.trim().length === 0) {
      return res.status(400).json({
        message: "La contraseña es obligatoria",
      })
    }

    // Validar que el rol exista
    if (userData.role) {
      const existingRole = await Role.findById(userData.role)
      if (!existingRole) {
        return res.status(400).json({
          message: "El rol especificado no existe",
        })
      }
      if (!existingRole.status) {
        return res.status(400).json({
          message: "El rol especificado está inactivo",
        })
      }

      // Validar coherencia entre tipoUsuario y rol
      const isValidRole = await validateUserRole(userData.tipoUsuario, userData.role)
      if (!isValidRole) {
        return res.status(400).json({
          message: `El rol no es válido para un ${userData.tipoUsuario}`,
        })
      }
    } else {
      return res.status(400).json({
        message: "El rol es obligatorio",
      })
    }

    // Validar que no exista un usuario con el mismo documento
    const existingUser = await User.findOne({ documento: userData.documento })
    if (existingUser) {
      console.log(`Ya existe un usuario con documento: ${userData.documento}`)
      return res.status(400).json({
        message: "Ya existe un usuario con este documento",
      })
    }

    // Preparar datos según el tipo de usuario
    const cleanUserData = prepareUserData(userData)

    // Validar datos específicos de aprendices
    const apprenticeValidationErrors = validateApprenticeData(cleanUserData)
    if (apprenticeValidationErrors.length > 0) {
      return res.status(400).json({
        message: "Datos de aprendiz inválidos",
        errors: apprenticeValidationErrors,
      })
    }

    const user = new User(cleanUserData)
    const savedUser = await user.save()

    // Poblar el rol en la respuesta
    await savedUser.populate("role", "name description status")

    console.log(`Usuario creado exitosamente: ${savedUser.nombre} ${savedUser.apellido} (${savedUser.tipoUsuario})`)
    res.status(201).json(savedUser.toCleanJSON())
  } catch (error) {
    console.error("Error al crear usuario:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        message: "Datos inválidos",
        errors,
      })
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return res.status(400).json({
        message: `Ya existe un usuario con este ${field}`,
      })
    }

    res.status(500).json({
      message: "Error al crear usuario",
      error: error.message,
    })
  }
}

// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    console.log(`=== ACTUALIZANDO USUARIO CON ID: ${req.params.id} ===`)
    console.log("Datos de actualización:", req.body)

    const { id } = req.params
    const updateData = req.body

    // Obtener usuario actual para verificar tipo
    const currentUser = await User.findById(id).populate("role")
    if (!currentUser) {
      console.log("Usuario no encontrado para actualizar")
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // No permitir cambio de tipo de usuario
    if (updateData.tipoUsuario && updateData.tipoUsuario !== currentUser.tipoUsuario) {
      return res.status(400).json({
        message: "No se puede cambiar el tipo de usuario",
      })
    }

    // Validar documento único (excluyendo el usuario actual)
    if (updateData.documento && updateData.documento !== currentUser.documento) {
      const existingUser = await User.findOne({
        documento: updateData.documento,
        _id: { $ne: id },
      })
      if (existingUser) {
        console.log(`Ya existe otro usuario con documento: ${updateData.documento}`)
        return res.status(400).json({
          message: "Ya existe otro usuario con este documento",
        })
      }
    }

    // Validar rol si se está actualizando
    if (updateData.role) {
      const existingRole = await Role.findById(updateData.role)
      if (!existingRole) {
        return res.status(400).json({
          message: "El rol especificado no existe",
        })
      }
      if (!existingRole.status) {
        return res.status(400).json({
          message: "El rol especificado está inactivo",
        })
      }

      // Validar coherencia entre tipoUsuario y rol
      const isValidRole = await validateUserRole(currentUser.tipoUsuario, updateData.role)
      if (!isValidRole) {
        return res.status(400).json({
          message: `El rol no es válido para un ${currentUser.tipoUsuario}`,
        })
      }
    }

    // Validar estado según tipo de usuario
    if (updateData.estado) {
      const estadosAprendiz = ["En formación", "Condicionado", "Retirado", "Graduado"]
      const estadosInstructor = ["Activo", "Inactivo"]

      if (currentUser.tipoUsuario === "aprendiz" && !estadosAprendiz.includes(updateData.estado)) {
        return res.status(400).json({
          message: "Estado no válido para aprendices. Estados permitidos: " + estadosAprendiz.join(", "),
        })
      }

      if (currentUser.tipoUsuario === "instructor" && !estadosInstructor.includes(updateData.estado)) {
        return res.status(400).json({
          message: "Estado no válido para instructores. Estados permitidos: " + estadosInstructor.join(", "),
        })
      }
    }

    // Validar puntos si se están actualizando
    if (updateData.puntos !== undefined) {
      if (currentUser.tipoUsuario !== "aprendiz") {
        return res.status(400).json({
          message: "Solo los aprendices pueden tener puntos",
        })
      }
      if (!Number.isInteger(updateData.puntos) || updateData.puntos < 0) {
        return res.status(400).json({
          message: "Los puntos deben ser un número entero mayor o igual a 0",
        })
      }
    }

    // Preparar datos de actualización
    const cleanUpdateData = prepareUserData({
      ...updateData,
      tipoUsuario: currentUser.tipoUsuario,
    })

    // Validar datos específicos de aprendices
    const apprenticeValidationErrors = validateApprenticeData(cleanUpdateData)
    if (apprenticeValidationErrors.length > 0) {
      return res.status(400).json({
        message: "Datos de aprendiz inválidos",
        errors: apprenticeValidationErrors,
      })
    }

    const user = await User.findByIdAndUpdate(id, cleanUpdateData, { new: true, runValidators: true }).populate(
      "role",
      "name description status",
    )

    console.log(`Usuario actualizado exitosamente: ${user.nombre} ${user.apellido}`)
    res.status(200).json(user.toCleanJSON())
  } catch (error) {
    console.error("Error al actualizar usuario:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({
        message: "Datos inválidos",
        errors,
      })
    }

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido" })
    }

    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    })
  }
}

// Eliminar un usuario
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

// Actualizar progreso de un aprendiz
export const updateProgress = async (req, res) => {
  try {
    console.log(`=== ACTUALIZANDO PROGRESO DE APRENDIZ CON ID: ${req.params.id} ===`)
    console.log("Datos de progreso:", req.body)

    const { id } = req.params
    const { progresoNiveles } = req.body

    // Validar estructura de progresoNiveles
    if (!Array.isArray(progresoNiveles) || progresoNiveles.length !== 3) {
      return res.status(400).json({
        message: "progresoNiveles debe ser un array con 3 elementos",
      })
    }

    // Verificar que sea un aprendiz
    const user = await User.findById(id).populate("role", "name description status")
    if (!user) {
      console.log("Usuario no encontrado")
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    if (user.tipoUsuario !== "aprendiz") {
      return res.status(400).json({
        message: "Solo se puede actualizar el progreso de aprendices",
      })
    }

    // Validar estructura de cada nivel
    for (let i = 0; i < progresoNiveles.length; i++) {
      const nivel = progresoNiveles[i]
      if (!nivel.nivel || !nivel.hasOwnProperty("porcentaje")) {
        return res.status(400).json({
          message: `Estructura inválida en nivel ${i + 1}`,
        })
      }
      if (nivel.porcentaje < 0 || nivel.porcentaje > 100) {
        return res.status(400).json({
          message: `Porcentaje inválido en nivel ${nivel.nivel}`,
        })
      }
    }

    // Calcular progreso general
    const progresoGeneral = Math.round(
      progresoNiveles.reduce((sum, nivel) => sum + nivel.porcentaje, 0) / progresoNiveles.length,
    )

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        progresoNiveles,
        progresoActual: progresoGeneral,
      },
      { new: true, runValidators: true },
    ).populate("role", "name description status")

    console.log(`Progreso actualizado exitosamente para: ${updatedUser.nombre} ${updatedUser.apellido}`)
    res.status(200).json(updatedUser.toCleanJSON())
  } catch (error) {
    console.error("Error al actualizar progreso:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido" })
    }

    res.status(500).json({
      message: "Error al actualizar progreso",
      error: error.message,
    })
  }
}

// Actualizar puntos de un aprendiz
export const updatePoints = async (req, res) => {
  try {
    console.log(`=== ACTUALIZANDO PUNTOS DE APRENDIZ CON ID: ${req.params.id} ===`)
    console.log("Datos de puntos:", req.body)

    const { id } = req.params
    const { puntos, operacion = "set" } = req.body

    // Verificar que sea un aprendiz
    const user = await User.findById(id).populate("role", "name description status")
    if (!user) {
      console.log("Usuario no encontrado")
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    if (user.tipoUsuario !== "aprendiz") {
      return res.status(400).json({
        message: "Solo se pueden actualizar los puntos de aprendices",
      })
    }

    // Validar puntos
    if (!Number.isInteger(puntos) || puntos < 0) {
      return res.status(400).json({
        message: "Los puntos deben ser un número entero mayor o igual a 0",
      })
    }

    let nuevosPuntos = puntos

    // Calcular nuevos puntos según la operación
    if (operacion === "add") {
      nuevosPuntos = (user.puntos || 0) + puntos
    } else if (operacion === "subtract") {
      nuevosPuntos = Math.max(0, (user.puntos || 0) - puntos)
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { puntos: nuevosPuntos },
      { new: true, runValidators: true },
    ).populate("role", "name description status")

    console.log(`Puntos actualizados exitosamente para: ${updatedUser.nombre} ${updatedUser.apellido}`)
    console.log(`Puntos anteriores: ${user.puntos || 0}, Nuevos puntos: ${nuevosPuntos}`)
    res.status(200).json(updatedUser.toCleanJSON())
  } catch (error) {
    console.error("Error al actualizar puntos:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido" })
    }

    res.status(500).json({
      message: "Error al actualizar puntos",
      error: error.message,
    })
  }
}

// Añadir una ficha a un instructor
export const addFichaToInstructor = async (req, res) => {
  try {
    console.log(`=== AÑADIENDO FICHA AL INSTRUCTOR CON ID: ${req.params.id} ===`)
    console.log("Datos de la ficha:", req.body)

    const { id } = req.params
    const fichaData = req.body

    // Validar que la ficha tenga los campos requeridos
    if (!fichaData.numero || !fichaData.nivel || !fichaData.programa || !fichaData.fechaInicio || !fichaData.fechaFin) {
      return res.status(400).json({
        message: "Faltan campos requeridos para la ficha: numero, nivel, programa, fechaInicio, fechaFin",
      })
    }

    const user = await User.findById(id).populate("role", "name description status")
    if (!user) {
      console.log("Usuario no encontrado")
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    if (user.tipoUsuario !== "instructor") {
      return res.status(400).json({ message: "Solo se pueden añadir fichas a instructores" })
    }

    // Verificar que no exista ya una ficha con el mismo número
    const existingFicha = user.fichas.find((ficha) => ficha.numero === fichaData.numero)
    if (existingFicha) {
      console.log(`Ya existe una ficha con número: ${fichaData.numero}`)
      return res.status(400).json({ message: "Ya existe una ficha con este número para este instructor" })
    }

    // Añadir la nueva ficha
    user.fichas.push({
      numero: fichaData.numero,
      nivel: fichaData.nivel,
      programa: fichaData.programa,
      fechaInicio: fichaData.fechaInicio,
      fechaFin: fichaData.fechaFin,
      estudiantes: fichaData.estudiantes || [],
    })

    const updatedUser = await user.save()
    await updatedUser.populate("role", "name description status")

    console.log(`Ficha añadida exitosamente al instructor: ${user.nombre} ${user.apellido}`)
    res.status(200).json(updatedUser.toCleanJSON())
  } catch (error) {
    console.error("Error al añadir ficha:", error)
    res.status(500).json({ message: "Error al añadir ficha", error: error.message })
  }
}

// Actualizar una ficha específica de un instructor
export const updateFichaFromInstructor = async (req, res) => {
  try {
    console.log(`=== ACTUALIZANDO FICHA DEL INSTRUCTOR CON ID: ${req.params.id} ===`)
    console.log(`ID de la ficha: ${req.params.fichaId}`)
    console.log("Datos de actualización:", req.body)

    const { id, fichaId } = req.params
    const updateData = req.body

    const user = await User.findById(id).populate("role", "name description status")
    if (!user) {
      console.log("Usuario no encontrado")
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    if (user.tipoUsuario !== "instructor") {
      return res.status(400).json({ message: "Solo se pueden actualizar fichas de instructores" })
    }

    const ficha = user.fichas.id(fichaId)
    if (!ficha) {
      console.log("Ficha no encontrada")
      return res.status(404).json({ message: "Ficha no encontrada" })
    }

    // Actualizar los campos de la ficha
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        ficha[key] = updateData[key]
      }
    })

    const updatedUser = await user.save()
    await updatedUser.populate("role", "name description status")

    console.log(`Ficha actualizada exitosamente`)
    res.status(200).json(updatedUser.toCleanJSON())
  } catch (error) {
    console.error("Error al actualizar ficha:", error)
    res.status(500).json({ message: "Error al actualizar ficha", error: error.message })
  }
}

// Eliminar una ficha específica de un instructor
export const removeFichaFromInstructor = async (req, res) => {
  try {
    console.log(`=== ELIMINANDO FICHA DEL INSTRUCTOR CON ID: ${req.params.id} ===`)
    console.log(`ID de la ficha: ${req.params.fichaId}`)

    const { id, fichaId } = req.params

    const user = await User.findById(id).populate("role", "name description status")
    if (!user) {
      console.log("Usuario no encontrado")
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    if (user.tipoUsuario !== "instructor") {
      return res.status(400).json({ message: "Solo se pueden eliminar fichas de instructores" })
    }

    const ficha = user.fichas.id(fichaId)
    if (!ficha) {
      console.log("Ficha no encontrada")
      return res.status(404).json({ message: "Ficha no encontrada" })
    }

    // Eliminar la ficha
    user.fichas.pull(fichaId)
    const updatedUser = await user.save()
    await updatedUser.populate("role", "name description status")

    console.log(`Ficha eliminada exitosamente`)
    res.status(200).json({ message: "Ficha eliminada exitosamente", user: updatedUser.toCleanJSON() })
  } catch (error) {
    console.error("Error al eliminar ficha:", error)
    res.status(500).json({ message: "Error al eliminar ficha", error: error.message })
  }
}

// Actualización masiva de usuarios
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

    // No permitir cambio de tipoUsuario en actualización masiva
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

// Obtener estadísticas de usuarios
export const getUserStats = async (req, res) => {
  try {
    console.log("=== OBTENIENDO ESTADÍSTICAS DE USUARIOS ===")

    // Estadísticas generales
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

    // Estadísticas específicas de aprendices
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

    // Estadísticas específicas de instructores
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

    const result = {
      general: generalStats,
      aprendices: apprenticeStats[0] || {},
      instructores: instructorStats[0] || {},
    }

    console.log("Estadísticas calculadas:", result)
    res.status(200).json(result)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ message: "Error al obtener estadísticas", error: error.message })
  }
}

// Función auxiliar para preparar datos según el tipo de usuario
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
    role: userData.role, // NUEVO CAMPO
  }

  if (userData.tipoUsuario === "aprendiz") {
    return {
      ...baseData,
      ficha: Array.isArray(userData.ficha) ? userData.ficha : [userData.ficha],
      nivel: Number.parseInt(userData.nivel) || 1,
      programa: userData.programa?.trim(),
      progresoActual: Number.parseInt(userData.progresoActual) || 0,
      progresoNiveles: userData.progresoNiveles || [
        { nivel: 1, porcentaje: 0 },
        { nivel: 2, porcentaje: 0 },
        { nivel: 3, porcentaje: 0 },
      ],
      puntos: Number.parseInt(userData.puntos) || 0,
    }
  } else if (userData.tipoUsuario === "instructor") {
    return {
      ...baseData,
      fichas: userData.fichas || [],
    }
  }

  return baseData
}
// #fin modulos dickson
