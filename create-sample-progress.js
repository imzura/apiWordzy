import mongoose from "mongoose"
import ApprenticeProgress from "./src/models/apprenticeProgress.js"

// Script para crear datos de ejemplo con temas específicos del nivel 1

async function createSampleProgress() {
  try {
    // Conectar a la base de datos
    await mongoose.connect("mongodb://127.0.0.1:27017/ApiWordzy", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Conectado a MongoDB")

    // Datos de ejemplo basados en la programación del nivel 1
    const sampleData = [
      // TEMA 1 (topicId: "68647811d7e395f1bb05de8a") - Evaluaciones
      {
        apprenticeId: "68649a3a103e64c3cc1a3e09", // ID del aprendiz
        courseId: "686477edd7e395f1bb05de23", // ID de un curso existente
        courseProgrammingId: "6864799cd7e395f1bb05df18", // ID de programación (usar el de tu JSON)
        evaluationId: "68647857d7e395f1bb05de97", // ID de la actividad del tema 1
        level: 1,
        topicId: "68647811d7e395f1bb05de8a", // ID del tema 1
        score: 85,
        maxScore: 100,
        percentage: 85,
        timeSpent: 25,
        passed: true, // Aprobado porque score >= 70
        status: "completed",
        attemptNumber: 1,
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        apprenticeId: "68649a3a103e64c3cc1a3e09",
        courseId: "686477edd7e395f1bb05de23",
        courseProgrammingId: "6864799cd7e395f1bb05df18",
        evaluationId: "68647871d7e395f1bb05de9c", // ID del examen del tema 1
        level: 1,
        topicId: "68647811d7e395f1bb05de8a", // ID del tema 1
        score: 78,
        maxScore: 100,
        percentage: 78,
        timeSpent: 35,
        passed: true, // Aprobado
        status: "completed",
        attemptNumber: 1,
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // TEMA 2 (topicId: "68647833d7e395f1bb05de8e") - Evaluaciones
      {
        apprenticeId: "68649a3a103e64c3cc1a3e09",
        courseId: "686477edd7e395f1bb05de23",
        courseProgrammingId: "6864799cd7e395f1bb05df18",
        evaluationId: "686478a6d7e395f1bb05deac", // ID de la actividad del tema 2
        level: 1,
        topicId: "68647833d7e395f1bb05de8e", // ID del tema 2
        score: 92,
        maxScore: 100,
        percentage: 92,
        timeSpent: 20,
        passed: true, // Aprobado
        status: "completed",
        attemptNumber: 1,
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        apprenticeId: "68649a3a103e64c3cc1a3e09",
        courseId: "686477edd7e395f1bb05de23",
        courseProgrammingId: "6864799cd7e395f1bb05df18",
        evaluationId: "686478cdd7e395f1bb05deb3", // ID del examen del tema 2
        level: 1,
        topicId: "68647833d7e395f1bb05de8e", // ID del tema 2
        score: 65,
        maxScore: 100,
        percentage: 65,
        timeSpent: 40,
        passed: false, // No aprobado porque score < 70
        status: "completed",
        attemptNumber: 1,
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Limpiar datos existentes (opcional)
    await ApprenticeProgress.deleteMany({})
    console.log("🗑️ Datos anteriores eliminados")

    // Insertar datos de ejemplo
    const created = await ApprenticeProgress.insertMany(sampleData)
    console.log(`✅ Creados ${created.length} registros de progreso`)

    // Mostrar resumen detallado
    console.log("\n📊 RESUMEN DE DATOS INSERTADOS:")
    console.log("👤 Aprendiz: 68649a3a103e64c3cc1a3e09")
    console.log("📚 Nivel: 1")
    console.log("\n📖 TEMA 1 (68647811d7e395f1bb05de8a):")
    console.log("  📝 Actividad (68647857d7e395f1bb05de97): 85/100 ✅ APROBADA")
    console.log("  📋 Examen (68647871d7e395f1bb05de9c): 78/100 ✅ APROBADO")
    console.log("\n📖 TEMA 2 (68647833d7e395f1bb05de8e):")
    console.log("  📝 Actividad (686478a6d7e395f1bb05deac): 92/100 ✅ APROBADA")
    console.log("  📋 Examen (686478cdd7e395f1bb05deb3): 65/100 ❌ NO APROBADO")

    console.log("\n🎯 ESTADÍSTICAS:")
    const totalEvaluations = sampleData.length
    const passedEvaluations = sampleData.filter((item) => item.passed).length
    const averageScore = Math.round(sampleData.reduce((sum, item) => sum + item.score, 0) / totalEvaluations)

    console.log(`  📝 Total evaluaciones: ${totalEvaluations}`)
    console.log(`  ✅ Evaluaciones aprobadas: ${passedEvaluations}`)
    console.log(`  📊 Promedio de puntaje: ${averageScore}`)
    console.log(`  🎯 Tasa de aprobación: ${Math.round((passedEvaluations / totalEvaluations) * 100)}%`)

    console.log("\n📊 Datos de ejemplo creados exitosamente")
  } catch (error) {
    console.error("❌ Error creando datos de ejemplo:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Desconectado de MongoDB")
  }
}

// Ejecutar el script
createSampleProgress()
