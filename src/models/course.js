// // import mongoose, { model, Schema } from "mongoose"

// // const CourseSchema = new Schema(
// //   {
// //     code: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       trim: true,
// //     },
// //     offer_type: {
// //       type: String,
// //       enum: ["ABIERTA", "CERRADA", "ESPECIAL"],
// //       required: true,
// //     },
// //     start_date: {
// //       type: Date,
// //       required: true,
// //     },
// //     end_date: {
// //       type: Date,
// //       required: true,
// //     },
// //     internship_start_date: {
// //       type: Date,
// //     },
// //     terms_expiry_date: {
// //       type: Date,
// //     },
// //     area: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     fk_coordination: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     fk_itinerary: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     fk_programs: {
// //       type: String,
// //       required: true,
// //       trim: true,
// //     },
// //     course_status: {
// //       type: String,
// //       enum: ["EN EJECUCION", "TERMINADO", "SUSPENDIDO", "CANCELADO"],
// //       required: true,
// //     },
// //     quarter: {
// //       type: String,
// //       default: "0",
// //     },
// //     status: {
// //       type: Boolean,
// //       default: true,
// //     },
// //     externalId: {
// //       type: String,
// //       sparse: true, // Permite valores únicos pero también null/undefined
// //     },
// //   },
// //   {
// //     timestamps: true,
// //     toJSON: { virtuals: true },
// //     toObject: { virtuals: true },
// //   },
// // )

// // // Índices para mejorar rendimiento
// // CourseSchema.index({ code: 1 })
// // CourseSchema.index({ externalId: 1 })
// // CourseSchema.index({ status: 1 })
// // CourseSchema.index({ course_status: 1 })

// // export default mongoose.models.Course || model("Course", CourseSchema, "courses")
// import { DataTypes } from "sequelize"
// import sequelize from "../config/database.js"

// const Course = sequelize.define(
//   "Course",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     external_id: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       unique: true,
//     },
//     code: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     offer_type: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     start_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },
//     end_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },
//     internship_start_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },
//     terms_expiry_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },
//     area: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     fk_coordination: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     fk_itinerary: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     fk_programs: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     course_status: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     quarter: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     status: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//     internship_tart_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },
//   },
//   {
//     tableName: "courses",
//     timestamps: true,
//   },
// )

// export default Course
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
