import { model, Schema } from "mongoose";

const RoleSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del rol es requerido'],
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: [{
        permission: {
            type: Schema.Types.ObjectId,
            ref: 'Permission'
        },
        privileges: [{
            type: Schema.Types.ObjectId,
            ref: 'Privilege'
        }]
    }]
});

export default model('Role', RoleSchema, 'roles');