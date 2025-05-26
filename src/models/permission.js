import { model, Schema } from "mongoose";

const PermissionSchema = new Schema({
    module: {
    type: String,
    required: [true, 'El módulo es requerido'],
    enum: [
      'Dashboard',
      'Programas',
      'Fichas',
      'Instructores',
      'Aprendices',
      'Temas',
      'Material De Apoyo',
      'Evaluaciones',
      'Programacion De Cursos',
      'Escala De Valoracion',
      'Insignias',
      'Cursos Programados',
      'Ranking',
      'Retroalimentacion',
      'Roles'
    ]
  },
  canView: {
    type: Boolean,
    default: false
  },
  canCreate: {
    type: Boolean,
    default: false
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  canDelete: {
    type: Boolean,
    default: false
  }
});

export default model('Permission', PermissionSchema, 'permissions');