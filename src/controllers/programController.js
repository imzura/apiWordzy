import Program from "../models/program.js"
import axios from "axios"

// Configuración de la API externa
const EXTERNAL_API_URL = "https://sara-api-ingdanielbs-projects.vercel.app/api/v1/programs"
const API_KEY = "sara_d32775a2ea8a39a3.a14bb968e21a6be6821d19f2764945338ba182b972aff43732b0c7c8314d343a"

// Obtener todos los programas
export async function getProgram(req, res) {
  try {
    const programs = await Program.find()
    res.status(200).json(programs)
  } catch (error) {
    res.status(500).json({ message: "Error al cargar los programas", error })
  }
}

// Obtener programa por ID
export async function getProgramById(req, res) {
  try {
    const { id } = req.params
    const program = await Program.findById(id)

    if (!program) {
      return res.status(404).json({ message: "Programa no encontrado" })
    }

    res.status(200).json(program)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el programa", error })
  }
}

// Crear nuevo programa
export async function createProgram(req, res) {
  try {
    const programData = req.body
    const newProgram = new Program(programData)
    const savedProgram = await newProgram.save()

    res.status(201).json(savedProgram)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe un programa con ese nombre o código",
      })
    }
    res.status(500).json({ message: "Error al crear el programa", error })
  }
}

// Actualizar programa
export async function updateProgram(req, res) {
  try {
    const { id } = req.params
    const updateData = req.body

    const updatedProgram = await Program.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    if (!updatedProgram) {
      return res.status(404).json({ message: "Programa no encontrado" })
    }

    res.status(200).json(updatedProgram)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ya existe un programa con ese nombre o código",
      })
    }
    res.status(500).json({ message: "Error al actualizar el programa", error })
  }
}

// Eliminar programa
export async function deleteProgram(req, res) {
  try {
    const { id } = req.params
    const deletedProgram = await Program.findByIdAndDelete(id)

    if (!deletedProgram) {
      return res.status(404).json({ message: "Programa no encontrado" })
    }

    res.status(200).json({ message: "Programa eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el programa", error })
  }
}

// Obtener programas desde API externa
export async function getExternalPrograms(req, res) {
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

    // La API externa devuelve { success, message, data, pagination }
    if (!response.data.success) {
      return res.status(400).json({
        message: response.data.message || "Error en la API externa",
      })
    }

    res.status(200).json(response.data)
  } catch (error) {
    console.error("Error fetching external programs:", error)
    res.status(500).json({
      message: "Error al obtener programas de la API externa",
      error: error.message,
    })
  }
}

// Sincronización masiva de programas
export async function syncPrograms(req, res) {
  try {
    let allExternalPrograms = []
    let currentPage = 1
    let totalPages = 1

    // Obtener todos los programas paginados
    do {
      const response = await axios.get(EXTERNAL_API_URL, {
        headers: {
          "x-api-key": API_KEY,
        },
        params: {
          page: currentPage,
          limit: 50, // Obtener más registros por página para eficiencia
        },
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Error en la API externa")
      }

      allExternalPrograms = allExternalPrograms.concat(response.data.data)
      totalPages = response.data.pagination.totalPages
      currentPage++
    } while (currentPage <= totalPages)

    if (!Array.isArray(allExternalPrograms)) {
      return res.status(400).json({
        message: "Formato de datos inválido de la API externa",
      })
    }

    let created = 0
    let updated = 0
    let skipped = 0
    let errors = 0
    const errorDetails = []

    for (const externalProgram of allExternalPrograms) {
      try {
        // Mapear datos de la API externa al modelo local
        const programData = {
          name: externalProgram.name,
          code: externalProgram.code,
          fk_level: externalProgram.fk_level,
          fk_modality: externalProgram.fk_modality,
          status: externalProgram.status,
          // Campos adicionales
          abbreviation: externalProgram.abbreviation,
          version: externalProgram.version,
          externalId: externalProgram._id,
        }

        // Buscar si ya existe por código o ID externo
        const existingProgram = await Program.findOne({
          $or: [{ code: programData.code }, { externalId: programData.externalId }],
        })

        if (existingProgram) {
          // Verificar si hay cambios
          const hasChanges =
            existingProgram.name !== programData.name ||
            existingProgram.fk_level !== programData.fk_level ||
            existingProgram.fk_modality !== programData.fk_modality ||
            existingProgram.status !== programData.status ||
            existingProgram.abbreviation !== programData.abbreviation ||
            existingProgram.version !== programData.version

          if (hasChanges) {
            await Program.findByIdAndUpdate(existingProgram._id, programData)
            updated++
          } else {
            skipped++
          }
        } else {
          // Crear nuevo programa
          const newProgram = new Program(programData)
          await newProgram.save()
          created++
        }
      } catch (error) {
        console.error(`Error procesando programa ${externalProgram.name}:`, error)
        errors++
        errorDetails.push({
          program: externalProgram.name || externalProgram.code,
          error: error.message,
        })
      }
    }

    res.status(200).json({
      message: "Sincronización completada",
      summary: {
        total: allExternalPrograms.length,
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

// Función auxiliar para mapear niveles
function mapLevel(level) {
  if (!level) return "TECNICO"

  const levelMap = {
    tecnico: "TECNICO",
    técnico: "TECNICO",
    tecnologo: "TECNÓLOGO",
    tecnólogo: "TECNÓLOGO",
    especializacion: "ESPECIALIZACION",
    especialización: "ESPECIALIZACION",
    auxiliar: "AUXILIAR",
    operario: "OPERARIO",
  }

  return levelMap[level.toLowerCase()] || "TECNICO"
}

// Función auxiliar para mapear modalidades
function mapModality(modality) {
  if (!modality) return "PRESENCIAL"

  const modalityMap = {
    presencial: "PRESENCIAL",
    distancia: "A DISTANCIA",
    "a distancia": "A DISTANCIA",
    virtual: "VIRTUAL",
    combinado: "COMBINADO",
    mixto: "COMBINADO",
  }

  return modalityMap[modality.toLowerCase()] || "PRESENCIAL"
}

// Verificar conectividad con APIs
export async function checkConnectivity(req, res) {
  try {
    const results = {
      external: false,
      local: true, // Asumimos que la API local está funcionando si llegamos aquí
      timestamp: new Date().toISOString(),
      errors: [],
    }

    // Verificar API externa
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

    // Verificar base de datos local
    try {
      const count = await Program.countDocuments()
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
