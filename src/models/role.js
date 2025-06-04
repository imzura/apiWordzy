import { model, Schema } from "mongoose"

const RoleSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre del rol es requerido"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  permissions: [
    {
      permission: {
        type: Schema.Types.ObjectId,
        ref: "Permission",
        required: true,
      },
      canView: {
        type: Boolean,
        default: false,
      },
      canCreate: {
        type: Boolean,
        default: false,
      },
      canEdit: {
        type: Boolean,
        default: false,
      },
      canDelete: {
        type: Boolean,
        default: false,
      },
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
})

export default model("Role", RoleSchema, "roles")
