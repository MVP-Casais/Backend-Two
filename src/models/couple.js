import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Couple = sequelize.define('Couple', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  compartilhar_planner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  data_pareamento: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'casais',
  timestamps: false,
});

export default Couple;
