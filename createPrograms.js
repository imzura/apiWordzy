// scripts/insertPrograms.js
import mongoose from 'mongoose';
import Program from './src/models/program.js';  // Asegúrate de que la ruta es correcta

const MONGO_URI = 'mongodb://127.0.0.1:27017/ApiWordzy'; // Cambia esto a tu URI real

const programs = [
  {
    name: 'Análisis y Desarrollo de Software (ADSO)',
    abbreviation: 'ADSO',
    code: '123456',
    fk_level: 'TECNICO',
    fk_modality: 'PRESENCIAL',
    status: true,
  },
  {
    name: 'Contabilidad y Finanzas',
    abbreviation: 'CONTABILIDAD',
    code: '234567',
    fk_level: 'TECNÓLOGO',
    fk_modality: 'VIRTUAL',
    status: true,
  },
  {
    name: 'Diseño Gráfico Digital',
    abbreviation: 'DISEÑO GRÁFICO',
    code: '345678',
    fk_level: 'TECNÓLOGO',
    fk_modality: 'PRESENCIAL',
    status: true,
  },
  {
    name: 'Mecánica Industrial',
    abbreviation: 'MECÁNICA',
    code: '456789',
    fk_level: 'TECNICO',
    fk_modality: 'COMBINADO',
    status: true,
  },
  {
    name: 'Gestión Empresarial',
    abbreviation: 'GESTIÓN',
    code: '567890',
    fk_level: 'ESPECIALIZACION',
    fk_modality: 'A DISTANCIA',
    status: true,
  },
];

const insertPrograms = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Program.insertMany(programs);
    console.log('Programas insertados correctamente');
  } catch (error) {
    console.error('Error insertando programas:', error);
  } finally {
    await mongoose.disconnect();
  }
};

insertPrograms();
