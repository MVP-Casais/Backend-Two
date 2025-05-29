import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const AppUsage = sequelize.define('AppUsage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  }
}, {
  tableName: 'app_usage',
  timestamps: false,
});

AppUsage.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(AppUsage, { foreignKey: 'userId' });

export default AppUsage;
