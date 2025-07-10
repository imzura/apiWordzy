import mongoose from 'mongoose';
import Permission from './src/models/permission.js'; // ajusta la ruta si es necesario

const uri = 'mongodb://127.0.0.1:27017/ApiWordzy'; // cambia el nombre de tu BD

const permisos = [
  'Dashboard',
  'Programas',
  'Fichas',
  'Instructores',
  'Aprendices',
  'Temas',
  'Material De Apoyo',
  'Evaluaciones',
  'Programacion De Cursos',
  'Asignación de Niveles',
  'Insignias',
  'Cursos Programados',
  'Ranking',
  'Retroalimentacion',
  'Roles'
];

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');

    for (const modulo of permisos) {
      const existe = await Permission.findOne({ module: modulo });
      if (existe) {
        console.log(`Ya existe permiso para módulo: ${modulo}`);
        continue;
      }

      const permiso = new Permission({
        module: modulo,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false
      });

      await permiso.save();
      console.log(`Permiso creado para módulo: ${modulo}`);
    }

    console.log('✅ Permisos insertados exitosamente');
  } catch (error) {
    console.error('❌ Error al insertar permisos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

run();
