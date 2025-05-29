import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Atividade from './activity.js';

const UserActivityStatus = sequelize.define('UserActivityStatus', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  atividadeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('salvo', 'concluido'),
    allowNull: false,
  },
  atualizadoEm: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'user_activity_status',
  timestamps: false,
});

UserActivityStatus.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(UserActivityStatus, { foreignKey: 'userId' });

UserActivityStatus.belongsTo(Atividade, { foreignKey: 'atividadeId' });
Atividade.hasMany(UserActivityStatus, { foreignKey: 'atividadeId' });

export default UserActivityStatus;
