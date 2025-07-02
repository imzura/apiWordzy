import mongoose, { model, Schema } from "mongoose";
import Topic from './topic.js'
import Program from './program.js';
import SupportMaterial from './supportMaterial.js';
import Evaluation from "./evaluation.js";

const SupportMaterialSchema = new Schema({
  materialId: {
    type: Schema.Types.ObjectId,
    ref: 'SupportMaterial',
    required: true
  }
});

const evaluationSchema = new Schema({
  evaluationId: {
    type: Schema.Types.ObjectId,
    ref: 'Evaluation',
    required: true,
  },
  value: {
    type: Number,
    required: true,
  }
});

const TopicSchema = new Schema({
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  name: { // nuevo campo
    type: String,
    required: true
  },
  description: { // nuevo campo
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  activities: [evaluationSchema], // tipoEvaluacion = 'Actividad'
  exams: [evaluationSchema],      // tipoEvaluacion = 'Examen'
  materials: [SupportMaterialSchema],
});

const LevelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  topics: {
    type: [TopicSchema]
  }
});

const CourseProgrammingSchema = new Schema({
  programId: {
    type: Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null,
  },
  status: {
    type: Boolean,
    default: true
  },
  levels: {
    type: [LevelSchema],
    validate: {
      validator: function (levels) {
        return levels.length >= 3;
      },
      message: 'Debe haber al menos 3 niveles.'
    }
  }
}, { timestamps: true });

export default mongoose.models.CourseProgramming || model('CourseProgramming', CourseProgrammingSchema, 'courseProgramings');
