import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Couple = sequelize.define('Couple', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user1Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user2Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  compartilhar_planner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'couples',
  timestamps: false,
});

export default Couple;
