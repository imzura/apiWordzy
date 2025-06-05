import Instructor from "../models/instructor.js"

// Obtener todos los instructores
export const getAllInstructors = async (req, res) => {
  try {
    console.log("=== OBTENIENDO TODOS LOS INSTRUCTORES ===")

    // Permitir filtros opcionales
    const { estado, nivel, programa } = req.query
    const filter = {}

    if (estado) {
      filter.estado = estado
      console.log(`Filtrando por estado: ${estado}`)
    }

    if (nivel) {
      filter["fichas.nivel"] = Number.parseInt(nivel)
      console.log(`Filtrando por nivel: ${nivel}`)
    }

    if (programa) {
      filter["fichas.programa"] = { $regex: programa, $options: "i" }
      console.log(`Filtrando por programa: ${programa}`)
    }

    const instructors = await Instructor.find(filter).sort({ createdAt: -1 })
    console.log(`Se encontraron ${instructors.length} instructores`)
    res.status(200).json(instructors)
  } catch (error) {
    console.error("Error al obtener instructores:", error)
    res.status(500).json({ message: "Error al obtener instructores", error: error.message })
  }
}

// Obtener un instructor por ID
export const getInstructorById = async (req, res) => {
  try {
    console.log(`=== OBTENIENDO INSTRUCTOR CON ID: ${req.params.id} ===`)
    const instructor = await Instructor.findById(req.params.id)
    if (!instructor) {
      console.log("Instructor no encontrado")
      return res.status(404).json({ message: "Instructor no encontrado" })
    }
    console.log(`Instructor encontrado: ${instructor.nombre} ${instructor.apellido}`)
    res.status(200).json(instructor)
  } catch (error) {
    console.error("Error al obtener instructor:", error)
    res.status(500).json({ message: "Error al obtener instructor", error: error.message })
  }
}

// Crear un nuevo instructor
export const createInstructor = async (req, res) => {
  try {
    console.log("=== CREANDO NUEVO INSTRUCTOR ===")
    console.log("Datos recibidos:", req.body)

    const { nombre, apellido, documento, tipoDocumento, estado, telefono, correo, fichas } = req.body

    // Validar que no exista un instructor con el mismo documento
    const existingInstructor = await Instructor.findOne({ documento })
    if (existingInstructor) {
      console.log(`Ya existe un instructor con documento: ${documento}`)
      return res.status(400).json({ message: "Ya existe un instructor con este documento" })
    }

    // Validar que no exista un instructor con el mismo correo
    const existingEmail = await Instructor.findOne({ correo: correo.toLowerCase() })
    if (existingEmail) {
      console.log(`Ya existe un instructor con correo: ${correo}`)
      return res.status(400).json({ message: "Ya existe un instructor con este correo" })
    }

    const instructor = new Instructor({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      documento: documento.trim(),
      tipoDocumento,
      estado: estado || "Activo",
      telefono: telefono.trim(),
      correo: correo.toLowerCase().trim(),
      fichas: fichas || [],
    })

    const savedInstructor = await instructor.save()
    console.log(`Instructor creado exitosamente: ${savedInstructor.nombre} ${savedInstructor.apellido}`)
    res.status(201).json(savedInstructor)
  } catch (error) {
    console.error("Error al crear instructor:", error)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Datos inválidos", errors })
    }
    res.status(500).json({ message: "Error al crear instructor", error: error.message })
  }
}

// Actualizar un instructor
export const updateInstructor = async (req, res) => {
  try {
    console.log(`=== ACTUALIZANDO INSTRUCTOR CON ID: ${req.params.id} ===`)
    console.log("Datos de actualización:", req.body)

    const { id } = req.params
    const updateData = req.body

    // Validar que no exista otro instructor con el mismo documento
    if (updateData.documento) {
      const existingInstructor = await Instructor.findOne({
        documento: updateData.documento,
        _id: { $ne: id },
      })
      if (existingInstructor) {
        console.log(`Ya existe otro instructor con documento: ${updateData.documento}`)
        return res.status(400).json({ message: "Ya existe otro instructor con este documento" })
      }
    }

    // Validar que no exista otro instructor con el mismo correo
    if (updateData.correo) {
      const existingEmail = await Instructor.findOne({
        correo: updateData.correo.toLowerCase(),
        _id: { $ne: id },
      })
      if (existingEmail) {
        console.log(`Ya existe otro instructor con correo: ${updateData.correo}`)
        return res.status(400).json({ message: "Ya existe otro instructor con este correo" })
      }
      updateData.correo = updateData.correo.toLowerCase().trim()
    }

    // Procesar campos de texto
    if (updateData.nombre) updateData.nombre = updateData.nombre.trim()
    if (updateData.apellido) updateData.apellido = updateData.apellido.trim()
    if (updateData.documento) updateData.documento = updateData.documento.trim()
    if (updateData.telefono) updateData.telefono = updateData.telefono.trim()

    const instructor = await Instructor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    if (!instructor) {
      console.log("Instructor no encontrado para actualizar")
      return res.status(404).json({ message: "Instructor no encontrado" })
    }

    console.log(`Instructor actualizado exitosamente: ${instructor.nombre} ${instructor.apellido}`)
    res.status(200).json(instructor)
  } catch (error) {
    console.error("Error al actualizar instructor:", error)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Datos inválidos", errors })
    }
    res.status(500).json({ message: "Error al actualizar instructor", error: error.message })
  }
}

// Eliminar un instructor
export const deleteInstructor = async (req, res) => {
  try {
    console.log(`=== ELIMINANDO INSTRUCTOR CON ID: ${req.params.id} ===`)
    const instructor = await Instructor.findByIdAndDelete(req.params.id)
    if (!instructor) {
      console.log("Instructor no encontrado para eliminar")
      return res.status(404).json({ message: "Instructor no encontrado" })
    }
    console.log(`Instructor eliminado exitosamente: ${instructor.nombre} ${instructor.apellido}`)
    res.status(200).json({ message: "Instructor eliminado exitosamente" })
  } catch (error) {
    console.error("Error al eliminar instructor:", error)
    res.status(500).json({ message: "Error al eliminar instructor", error: error.message })
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

    const instructor = await Instructor.findById(id)
    if (!instructor) {
      console.log("Instructor no encontrado")
      return res.status(404).json({ message: "Instructor no encontrado" })
    }

    // Verificar que no exista ya una ficha con el mismo número
    const existingFicha = instructor.fichas.find((ficha) => ficha.numero === fichaData.numero)
    if (existingFicha) {
      console.log(`Ya existe una ficha con número: ${fichaData.numero}`)
      return res.status(400).json({ message: "Ya existe una ficha con este número para este instructor" })
    }

    // Añadir la nueva ficha
    instructor.fichas.push({
      numero: fichaData.numero,
      nivel: fichaData.nivel,
      programa: fichaData.programa,
      fechaInicio: fichaData.fechaInicio,
      fechaFin: fichaData.fechaFin,
      estudiantes: fichaData.estudiantes || [],
    })

    const updatedInstructor = await instructor.save()
    console.log(`Ficha añadida exitosamente al instructor: ${instructor.nombre} ${instructor.apellido}`)
    res.status(200).json(updatedInstructor)
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

    const instructor = await Instructor.findById(id)
    if (!instructor) {
      console.log("Instructor no encontrado")
      return res.status(404).json({ message: "Instructor no encontrado" })
    }

    const ficha = instructor.fichas.id(fichaId)
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

    const updatedInstructor = await instructor.save()
    console.log(`Ficha actualizada exitosamente`)
    res.status(200).json(updatedInstructor)
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

    const instructor = await Instructor.findById(id)
    if (!instructor) {
      console.log("Instructor no encontrado")
      return res.status(404).json({ message: "Instructor no encontrado" })
    }

    const ficha = instructor.fichas.id(fichaId)
    if (!ficha) {
      console.log("Ficha no encontrada")
      return res.status(404).json({ message: "Ficha no encontrada" })
    }

    // Eliminar la ficha
    instructor.fichas.pull(fichaId)
    const updatedInstructor = await instructor.save()

    console.log(`Ficha eliminada exitosamente`)
    res.status(200).json({ message: "Ficha eliminada exitosamente", instructor: updatedInstructor })
  } catch (error) {
    console.error("Error al eliminar ficha:", error)
    res.status(500).json({ message: "Error al eliminar ficha", error: error.message })
  }
}

// Obtener estadísticas de instructores
export const getInstructorStats = async (req, res) => {
  try {
    console.log("=== OBTENIENDO ESTADÍSTICAS DE INSTRUCTORES ===")

    const stats = await Instructor.aggregate([
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

    const fichasPorNivel = await Instructor.aggregate([
      { $unwind: "$fichas" },
      {
        $group: {
          _id: "$fichas.nivel",
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const result = {
      ...stats[0],
      fichasPorNivel: fichasPorNivel.reduce((acc, item) => {
        acc[`nivel${item._id}`] = item.cantidad
        return acc
      }, {}),
    }

    console.log("Estadísticas calculadas:", result)
    res.status(200).json(result)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ message: "Error al obtener estadísticas", error: error.message })
  }
}
