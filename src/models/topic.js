import { model, Schema } from "mongoose";

const TopicSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true,
        set: function (value) {
            return value
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Quita tildes
                .replace(/\s+/g, " ") // Reemplaza espacios dobles
                .trim();
        }
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }
})

export default model('Topic', TopicSchema, 'topics')