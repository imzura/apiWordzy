import { model, Schema } from "mongoose";

const PermissionSchema = new Schema({
    module: {
        type: String,
        required: [true, 'El módulo es requerido'],
        unique: true
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

export default model('Permission', PermissionSchema, 'permissions');