import mongoose, { model, Schema } from "mongoose"

const ProgramSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  fk_level: {
    type: String,
    enum: ['TECNICO', 'TECNÓLOGO', 'ESPECIALIZACION', 'AUXILIAR', 'OPERARIO'], // puedes ajustar según tus niveles
    required: true
  },
  fk_modality: {
    type: String,
    enum: ['PRESENCIAL', 'A DISTANCIA', 'VIRTUAL', 'COMBINADO'], // puedes agregar más modalidades si existen
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

export default mongoose.models.Program || model('Program', ProgramSchema, 'programs');
