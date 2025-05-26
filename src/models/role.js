import { model, Schema } from "mongoose";

const RoleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del rol es requerido'],
        unique: true,
        trim: true,
        maxlength: [50, 'El nombre del rol no puede exceder los 50 caracteres']
    },
    description: {
        type: String,
        required: false
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    permissions: {
            type: Schema.Types.ObjectId,
            ref: 'Permission'
    },
    status: {
        type: Boolean,
        default: true
    },
});

export default model('Role', RoleSchema, 'roles');