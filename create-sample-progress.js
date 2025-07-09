import mongoose from "mongoose"
import ApprenticeProgress from "./src/models/apprenticeProgress.js"

// Script para crear datos que demuestren el cálculo correcto de puntos

async function createSampleProgressWithMultipleAttempts() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ApiWordzy", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ Conectado a MongoDB")

    const sampleData = [
      // ==========================================
      // EVALUACIÓN 1: Múltiples intentos - Solo el último aprobado debe contar
      // ==========================================

      // Primer intento - NO APROBADO (no debe contar para puntos)
      {
        apprenticeId: new mongoose.Types.ObjectId("686ec3123adf8116efcea6ea"),
        courseId: new mongoose.Types.ObjectId("686ec6673adf8116efcea8f4"),
        courseProgrammingId: new mongoose.Types.ObjectId("686ec7ab3adf8116efceaa32"),
        evaluationId: new mongoose.Types.ObjectId("686ec7493adf8116efceaa1d"), // verbo to be
        level: 1,
        score: 45,
        maxScore: 100,
        percentage: 45,
        timeSpent: 25,
        passed: false, // NO APROBADO
        status: "completed",
        attemptNumber: 1,
        startedAt: new Date("2025-07-09T19:30:00.000Z"),
        completedAt: new Date("2025-07-09T19:55:00.000Z"),
        createdAt: new Date("2025-07-09T19:55:00.000Z"),
        updatedAt: new Date("2025-07-09T19:55:00.000Z"),
        answers: [],
      },

      // Segundo intento - APROBADO (70 puntos - debe contar)
      {
        apprenticeId: new mongoose.Types.ObjectId("686ec3123adf8116efcea6ea"),
        courseId: new mongoose.Types.ObjectId("686ec6673adf8116efcea8f4"),
        courseProgrammingId: new mongoose.Types.ObjectId("686ec7ab3adf8116efceaa32"),
        evaluationId: new mongoose.Types.ObjectId("686ec7493adf8116efceaa1d"), // verbo to be
        level: 1,
        score: 70,
        maxScore: 100,
        percentage: 70,
        timeSpent: 22,
        passed: true, // APROBADO
        status: "completed",
        attemptNumber: 2,
        startedAt: new Date("2025-07-09T20:00:00.000Z"),
        completedAt: new Date("2025-07-09T20:22:00.000Z"),
        createdAt: new Date("2025-07-09T20:22:00.000Z"),
        updatedAt: new Date("2025-07-09T20:22:00.000Z"),
        answers: [],
      },

      // Tercer intento - APROBADO (85 puntos - este debe contar, no el anterior)
      {
        apprenticeId: new mongoose.Types.ObjectId("686ec3123adf8116efcea6ea"),
        courseId: new mongoose.Types.ObjectId("686ec6673adf8116efcea8f4"),
        courseProgrammingId: new mongoose.Types.ObjectId("686ec7ab3adf8116efceaa32"),
        evaluationId: new mongoose.Types.ObjectId("686ec7493adf8116efceaa1d"), // verbo to be
        level: 1,
        score: 85,
        maxScore: 100,
        percentage: 85,
        timeSpent: 20,
        passed: true, // APROBADO - ÚLTIMO INTENTO
        status: "completed",
        attemptNumber: 3,
        startedAt: new Date("2025-07-09T21:00:00.000Z"),
        completedAt: new Date("2025-07-09T21:20:00.000Z"),
        createdAt: new Date("2025-07-09T21:20:00.000Z"),
        updatedAt: new Date("2025-07-09T21:20:00.000Z"),
        answers: [],
      },

      // ==========================================
      // EVALUACIÓN 2: Un solo intento aprobado
      // ==========================================

      {
        apprenticeId: new mongoose.Types.ObjectId("686ec3123adf8116efcea6ea"),
        courseId: new mongoose.Types.ObjectId("686ec6673adf8116efcea8f4"),
        courseProgrammingId: new mongoose.Types.ObjectId("686ec7ab3adf8116efceaa32"),
        evaluationId: new mongoose.Types.ObjectId("686ec76b3adf8116efceaa22"), // verbo to be 2
        level: 1,
        score: 92,
        maxScore: 100,
        percentage: 92,
        timeSpent: 30,
        passed: true, // APROBADO - ÚNICO INTENTO (92 puntos deben contar)
        status: "completed",
        attemptNumber: 1,
        startedAt: new Date("2025-07-09T22:00:00.000Z"),
        completedAt: new Date("2025-07-09T22:30:00.000Z"),
        createdAt: new Date("2025-07-09T22:30:00.000Z"),
        updatedAt: new Date("2025-07-09T22:30:00.000Z"),
        answers: [],
      },

      // ==========================================
      // EVALUACIÓN 3: Múltiples intentos, último no aprobado
      // ==========================================

      // Primer intento - APROBADO (80 puntos - debe contar porque es el último aprobado)
      {
        apprenticeId: new mongoose.Types.ObjectId("686ec3123adf8116efcea6ea"),
        courseId: new mongoose.Types.ObjectId("686ec6673adf8116efcea8f4"),
        courseProgrammingId: new mongoose.Types.ObjectId("686ec7ab3adf8116efceaa32"),
        evaluationId: new mongoose.Types.ObjectId("686ec8a29e306911deeba8b4"), // presente simple
        level: 1,
        score: 80,
        maxScore: 100,
        percentage: 80,
        timeSpent: 25,
        passed: true, // APROBADO
        status: "completed",
        attemptNumber: 1,
        startedAt: new Date("2025-07-10T09:00:00.000Z"),
        completedAt: new Date("2025-07-10T09:25:00.000Z"),
        createdAt: new Date("2025-07-10T09:25:00.000Z"),
        updatedAt: new Date("2025-07-10T09:25:00.000Z"),
        answers: [],
      },

      // Segundo intento - NO APROBADO (no debe afectar el conteo de puntos)
      {
        apprenticeId: new mongoose.Types.ObjectId("686ec3123adf8116efcea6ea"),
        courseId: new mongoose.Types.ObjectId("686ec6673adf8116efcea8f4"),
        courseProgrammingId: new mongoose.Types.ObjectId("686ec7ab3adf8116efceaa32"),
        evaluationId: new mongoose.Types.ObjectId("686ec8a29e306911deeba8b4"), // presente simple
        level: 1,
        score: 55,
        maxScore: 100,
        percentage: 55,
        timeSpent: 28,
        passed: false, // NO APROBADO
        status: "completed",
        attemptNumber: 2,
        startedAt: new Date("2025-07-10T10:00:00.000Z"),
        completedAt: new Date("2025-07-10T10:28:00.000Z"),
        createdAt: new Date("2025-07-10T10:28:00.000Z"),
        updatedAt: new Date("2025-07-10T10:28:00.000Z"),
        answers: [],
      },

      // ==========================================
      // EVALUACIÓN 4: Solo intentos no aprobados
      // ==========================================

      {
        apprenticeId: new mongoose.Types.ObjectId("686ec3123adf8116efcea6ea"),
        courseId: new mongoose.Types.ObjectId("686ec6673adf8116efcea8f4"),
        courseProgrammingId: new mongoose.Types.ObjectId("686ec7ab3adf8116efceaa32"),
        evaluationId: new mongoose.Types.ObjectId("686ec8c99e306911deeba8bb"), // Presente Simple
        level: 1,
        score: 45,
        maxScore: 100,
        percentage: 45,
        timeSpent: 35,
        passed: false, // NO APROBADO (0 puntos deben contar)
        status: "completed",
        attemptNumber: 1,
        startedAt: new Date("2025-07-10T11:00:00.000Z"),
        completedAt: new Date("2025-07-10T11:35:00.000Z"),
        createdAt: new Date("2025-07-10T11:35:00.000Z"),
        updatedAt: new Date("2025-07-10T11:35:00.000Z"),
        answers: [],
      },
    ]

    // Limpiar datos existentes
    await ApprenticeProgress.deleteMany({
      apprenticeId: new mongoose.Types.ObjectId("686ec3123adf8116efcea6ea"),
      level: 1,
    })
    console.log("🗑️ Datos anteriores eliminados")

    // Insertar datos
    const created = await ApprenticeProgress.insertMany(sampleData)
    console.log(`✅ Creados ${created.length} registros de progreso`)

    // Análisis de los datos insertados
    console.log("\n" + "=".repeat(70))
    console.log("📊 ANÁLISIS DE CÁLCULO DE PUNTOS")
    console.log("=".repeat(70))

    console.log("\n📝 EVALUACIÓN 1 (verbo to be - 686ec7493adf8116efceaa1d):")
    console.log("   🔄 Intento 1: 45/100 ❌ NO APROBADO")
    console.log("   🔄 Intento 2: 70/100 ✅ APROBADO")
    console.log("   🔄 Intento 3: 85/100 ✅ APROBADO (ÚLTIMO)")
    console.log("   💡 Puntos que deben contar: 85 (último intento aprobado)")

    console.log("\n📝 EVALUACIÓN 2 (verbo to be 2 - 686ec76b3adf8116efceaa22):")
    console.log("   🔄 Intento 1: 92/100 ✅ APROBADO (ÚNICO)")
    console.log("   💡 Puntos que deben contar: 92")

    console.log("\n📝 EVALUACIÓN 3 (presente simple - 686ec8a29e306911deeba8b4):")
    console.log("   🔄 Intento 1: 80/100 ✅ APROBADO (ÚLTIMO APROBADO)")
    console.log("   🔄 Intento 2: 55/100 ❌ NO APROBADO")
    console.log("   💡 Puntos que deben contar: 80 (último intento aprobado)")

    console.log("\n📝 EVALUACIÓN 4 (Presente Simple - 686ec8c99e306911deeba8bb):")
    console.log("   🔄 Intento 1: 45/100 ❌ NO APROBADO")
    console.log("   💡 Puntos que deben contar: 0 (nunca aprobada)")

    console.log("\n" + "=".repeat(70))
    console.log("🎯 RESULTADO ESPERADO")
    console.log("=".repeat(70))
    console.log("📊 Total de intentos registrados: 7")
    console.log("📊 Evaluaciones únicas aprobadas: 3 de 4")
    console.log("📊 Puntos Totales Obtenidos: 85 + 92 + 80 = 257 puntos")
    console.log("📊 Promedio por evaluación aprobada: 85.7 puntos")

    console.log("\n✅ Datos creados para probar el cálculo correcto de puntos")
    console.log("🔍 Verifica que en la aplicación muestre:")
    console.log("   - Evaluaciones Aprobadas: 3/4")
    console.log("   - Puntos Totales Obtenidos: 257")
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Desconectado de MongoDB")
  }
}

createSampleProgressWithMultipleAttempts()
