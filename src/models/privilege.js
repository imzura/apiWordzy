import { model, Schema } from "mongoose";

const PrivilegeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del privilegio es requerido'],
        unique: true
    },
    action: {
        type: String,
        required: [true, 'La acción es requerida'],
        enum: ['create', 'read', 'update', 'delete']
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }
});

export default model('Privilege', PrivilegeSchema, 'privileges');