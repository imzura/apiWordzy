import Apprentice from "../models/apprentice.js"

// Obtener todos los aprendices
export const getAllApprentices = async (req, res) => {
  try {
    console.log("=== OBTENIENDO TODOS LOS APRENDICES ===")

    // Permitir filtros opcionales
    const { estado, nivel, ficha, programa } = req.query
    const filter = {}

    if (estado) {
      filter.estado = estado
      console.log(`Filtrando por estado: ${estado}`)
    }

    if (nivel) {
      filter.nivel = Number.parseInt(nivel)
      console.log(`Filtrando por nivel: ${nivel}`)
    }

    if (ficha) {
      filter.ficha = { $in: [Number.parseInt(ficha)] }
      console.log(`Filtrando por ficha: ${ficha}`)
    }

    if (programa) {
      filter.programa = { $regex: programa, $options: "i" }
      console.log(`Filtrando por programa: ${programa}`)
    }

    const apprentices = await Apprentice.find(filter).sort({ createdAt: -1 })
    console.log(`Se encontraron ${apprentices.length} aprendices`)
    res.status(200).json(apprentices)
  } catch (error) {
    console.error("Error al obtener aprendices:", error)
    res.status(500).json({ message: "Error al obtener aprendices", error: error.message })
  }
}

// Obtener un aprendiz por ID
export const getApprenticeById = async (req, res) => {
  try {
    console.log(`=== OBTENIENDO APRENDIZ CON ID: ${req.params.id} ===`)
    const apprentice = await Apprentice.findById(req.params.id)
    if (!apprentice) {
      console.log("Aprendiz no encontrado")
      return res.status(404).json({ message: "Aprendiz no encontrado" })
    }
    console.log(`Aprendiz encontrado: ${apprentice.nombre} ${apprentice.apellido}`)
    res.status(200).json(apprentice)
  } catch (error) {
    console.error("Error al obtener aprendiz:", error)
    res.status(500).json({ message: "Error al obtener aprendiz", error: error.message })
  }
}

// Obtener estadísticas de aprendices
export const getApprenticeStats = async (req, res) => {
  try {
    console.log("=== OBTENIENDO ESTADÍSTICAS DE APRENDICES ===")

    const stats = await Apprentice.aggregate([
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
        },
      },
    ])

    const aprendicesPorNivel = await Apprentice.aggregate([
      {
        $group: {
          _id: "$nivel",
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const aprendicesPorFicha = await Apprentice.aggregate([
      { $unwind: "$ficha" },
      {
        $group: {
          _id: "$ficha",
          cantidad: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 10 }, // Limitar a las 10 fichas con más aprendices
    ])

    const result = {
      ...stats[0],
      aprendicesPorNivel: aprendicesPorNivel.reduce((acc, item) => {
        acc[`nivel${item._id}`] = item.cantidad
        return acc
      }, {}),
      topFichas: aprendicesPorFicha,
    }

    console.log("Estadísticas calculadas:", result)
    res.status(200).json(result)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ message: "Error al obtener estadísticas", error: error.message })
  }
}
