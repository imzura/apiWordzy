// Middleware para sanitizar los datos antes de procesarlos
export const sanitizeEvaluationData = (req, res, next) => {
  try {
    console.log("=== INICIO DE SANITIZACIÓN DE DATOS ===")
    console.log("Content-Type:", req.headers["content-type"])
    console.log("Body keys:", Object.keys(req.body))

    // Si hay preguntas en el body, procesarlas
    if (req.body.preguntas) {
      console.log("Tipo de preguntas recibido:", typeof req.body.preguntas)

      // Convertir a objeto si viene como string
      let preguntas
      try {
        preguntas = typeof req.body.preguntas === "string" ? JSON.parse(req.body.preguntas) : req.body.preguntas

        console.log(
          "Preguntas parseadas correctamente:",
          Array.isArray(preguntas) ? `Array con ${preguntas.length} elementos` : typeof preguntas,
        )
      } catch (parseError) {
        console.error("Error al parsear preguntas:", parseError)
        return res.status(400).json({
          message: "Error al procesar los datos de la evaluación",
          error: `Error al parsear el campo 'preguntas': ${parseError.message}`,
        })
      }

      // Sanitizar cada pregunta
      if (Array.isArray(preguntas)) {
        preguntas = preguntas.map((pregunta, index) => {
          console.log(`Sanitizando pregunta ${index + 1} de tipo ${pregunta.tipo}`)

          // Limpiar campos de objeto vacío
          // Corregido: Verificar que no sea null antes de usar Object.keys
          if (
            pregunta.imagen !== null &&
            typeof pregunta.imagen === "object" &&
            pregunta.imagen !== undefined &&
            Object.keys(pregunta.imagen).length === 0
          ) {
            console.log(`Convirtiendo imagen de objeto vacío a null en pregunta ${index + 1}`)
            pregunta.imagen = null
          }

          // Corregido: Verificar que no sea null antes de usar Object.keys
          if (
            pregunta.audio !== null &&
            typeof pregunta.audio === "object" &&
            pregunta.audio !== undefined &&
            Object.keys(pregunta.audio).length === 0
          ) {
            console.log(`Convirtiendo audio de objeto vacío a null en pregunta ${index + 1}`)
            pregunta.audio = null
          }

          // Asegurar que los arrays sean arrays
          if (!Array.isArray(pregunta.opciones)) {
            console.log(`Convirtiendo opciones a array vacío en pregunta ${index + 1}`)
            pregunta.opciones = []
          }

          if (!Array.isArray(pregunta.palabrasCompletar)) {
            console.log(`Convirtiendo palabrasCompletar a array vacío en pregunta ${index + 1}`)
            pregunta.palabrasCompletar = []
          }

          if (!Array.isArray(pregunta.opcionesRelleno)) {
            console.log(`Convirtiendo opcionesRelleno a array vacío en pregunta ${index + 1}`)
            pregunta.opcionesRelleno = []
          }

          // Asegurar que los strings sean strings
          if (pregunta.texto === undefined || pregunta.texto === null) {
            console.log(`Convirtiendo texto undefined/null a string vacío en pregunta ${index + 1}`)
            pregunta.texto = ""
          }

          if (pregunta.completarTexto === undefined || pregunta.completarTexto === null) {
            console.log(`Convirtiendo completarTexto undefined/null a string vacío en pregunta ${index + 1}`)
            pregunta.completarTexto = ""
          }

          return pregunta
        })
      } else {
        console.error("El campo preguntas no es un array:", typeof preguntas)
        return res.status(400).json({
          message: "Error al procesar los datos de la evaluación",
          error: "El campo 'preguntas' debe ser un array",
        })
      }

      // Actualizar el body con los datos sanitizados
      req.body.preguntas = preguntas
      console.log("Datos sanitizados correctamente")
    } else {
      console.error("No se encontró el campo 'preguntas' en la solicitud")
      return res.status(400).json({
        message: "Error al procesar los datos de la evaluación",
        error: "No se encontró el campo 'preguntas' en la solicitud",
      })
    }

    console.log("=== FIN DE SANITIZACIÓN DE DATOS ===")
    next()
  } catch (error) {
    console.error("Error en sanitizeEvaluationData:", error)
    return res.status(400).json({
      message: "Error al procesar los datos de la evaluación",
      error: error.message,
    })
  }
}
