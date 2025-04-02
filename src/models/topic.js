import { model, Schema } from "mongoose";

const TopicSchema = new Schema({
    name:{
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true
    },
    description:{
        type: String,
        required: [true, 'La descripción es requerida']
    },
    status:{
        type: Boolean,
        default: true
    }
})

export default model('Topic', TopicSchema, 'topics')