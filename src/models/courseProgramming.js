import mongoose, { model, Schema } from "mongoose"

const SupportMaterialSchema = new Schema({
  materialId: {
    type: Schema.Types.ObjectId,
    ref: "SupportMaterial",
    required: true,
  },
})

const evaluationSchema = new Schema({
  evaluationId: {
    type: Schema.Types.ObjectId,
    ref: "Evaluation",
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
})

const TopicSchema = new Schema({
  topicId: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  activities: {
    type: [evaluationSchema],
    default: [],
  },
  exams: {
    type: [evaluationSchema],
    default: [],
  },
  materials: {
    type: [SupportMaterialSchema],
    default: [],
  },
})

const LevelSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  // ✅ Campo actualizado para incluir la nueva validación
  completionDetails: {
    hasName: { type: Boolean, default: false },
    hasThemes: { type: Boolean, default: false },
    themesSum100: { type: Boolean, default: false }, // ✅ Nueva validación
    themesValid: { type: Boolean, default: false },
    activitiesValid: { type: Boolean, default: false },
    examsValid: { type: Boolean, default: false },
    materialsValid: { type: Boolean, default: false },
  },
  topics: {
    type: [TopicSchema],
    default: [],
  },
})

const CourseProgrammingSchema = new Schema(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    levels: {
      type: [LevelSchema],
      validate: {
        validator: (levels) => Array.isArray(levels) && levels.length >= 3 && levels.length <= 6,
        message: "Debe haber entre 3 y 6 niveles.",
      },
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "courseProgramings",
  },
)

export default mongoose.models.CourseProgramming || model("CourseProgramming", CourseProgrammingSchema)
