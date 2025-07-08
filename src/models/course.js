
import mongoose, { model, Schema } from "mongoose"

const CourseSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    offer_type: {
      type: String,
      enum: ["ABIERTA", "CERRADA", "ESPECIAL"],
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    internship_start_date: {
      type: Date,
    },
    terms_expiry_date: {
      type: Date,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    fk_coordination: {
      type: String,
      required: true,
      trim: true,
    },
    fk_itinerary: {
      type: String,
      required: true,
      trim: true,
    },
    fk_programs: {
      type: String,
      required: true,
      trim: true,
    },
    course_status: {
      type: String,
      enum: ["EN EJECUCION", "TERMINADO", "SUSPENDIDO", "CANCELADO"],
      required: true,
    },
    quarter: {
      type: String,
      default: "0",
    },
    status: {
      type: Boolean,
      default: true,
    },
    externalId: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// CourseSchema.index({ code: 1 })
// CourseSchema.index({ externalId: 1 })
CourseSchema.index({ status: 1 })
CourseSchema.index({ course_status: 1 })

export default mongoose.models.Course || model("Course", CourseSchema, "courses")
