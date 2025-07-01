import mongoose from "mongoose"
import ApprenticeProgress from "./src/models/apprenticeProgress.js"

// Script para crear datos de ejemplo
async function createSampleProgress() {
  try {
    // Conectar a la base de datos
    await mongoose.connect("mongodb://127.0.0.1:27017/ApiWordzy", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("✅ Conectado a MongoDB")

    // Datos de ejemplo
    const sampleData = [
      {
        apprenticeId: "685c90cc1f6fc34e4bb6ce65", // ID del aprendiz del error
        courseId: "685c86f17ee560354566d454", // ID de un curso existente
        courseProgrammingId: "685d3b049c41d605635d7e08", // ID de programación existente
        evaluationId: "685ca7d2480c377e9a592da4", // ID de evaluación existente
        level: 1,
        score: 85,
        maxScore: 100,
        timeSpent: 25,
        status: "completed",
        completedAt: new Date(),
      },
      {
        apprenticeId: "685c90cc1f6fc34e4bb6ce65",
        courseId: "685c86f17ee560354566d454",
        courseProgrammingId: "685d3b049c41d605635d7e08",
        evaluationId: "685cb3cd480c377e9a59322b", // Otro ID de evaluación
        level: 1,
        score: 65,
        maxScore: 100,
        timeSpent: 30,
        status: "completed",
        completedAt: new Date(),
      },
    ]

    // Limpiar datos existentes (opcional)
    await ApprenticeProgress.deleteMany({})
    console.log("🗑️ Datos anteriores eliminados")

    // Insertar datos de ejemplo
    const created = await ApprenticeProgress.insertMany(sampleData)
    console.log(`✅ Creados ${created.length} registros de progreso`)

    console.log("📊 Datos de ejemplo creados exitosamente")
  } catch (error) {
    console.error("❌ Error creando datos de ejemplo:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Desconectado de MongoDB")
  }
}

// Ejecutar el script
createSampleProgress()
