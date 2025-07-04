const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ranking = sequelize.define('Ranking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  criteria: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      pointsWeight: 0.7,
      averageScoreWeight: 0.3,
      completedActivitiesWeight: 0.0
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Programs',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Courses',
      key: 'id'
    }
  }
}, {
  tableName: 'rankings',
  timestamps: true
});

module.exports = Ranking;