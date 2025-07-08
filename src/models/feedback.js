const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  apprenticeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'apprentice_id'
  },
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'instructor_id'
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'course_id'
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  feedbackType: {
    type: DataTypes.ENUM('positivo', 'constructivo', 'neutral'),
    allowNull: false,
    field: 'feedback_type'
  },
  category: {
    type: DataTypes.ENUM('tecnico', 'actitudinal', 'participacion', 'puntualidad', 'trabajo_equipo'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  recommendations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('baja', 'media', 'alta'),
    defaultValue: 'media'
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'revisado', 'resuelto'),
    defaultValue: 'pendiente'
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_private'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'feedbacks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Asociaciones
Feedback.associate = (models) => {
  // Relación con Apprentice
  Feedback.belongsTo(models.Apprentice, {
    foreignKey: 'apprenticeId',
    as: 'apprentice'
  });

  // Relación con Instructor
  Feedback.belongsTo(models.Instructor, {
    foreignKey: 'instructorId',
    as: 'instructor'
  });

  // Relación con Course
  Feedback.belongsTo(models.Course, {
    foreignKey: 'courseId',
    as: 'course'
  });
};

module.exports = Feedback;