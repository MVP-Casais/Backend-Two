import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Couple from './couple.js';

const PresencaReal = sequelize.define('PresencaReal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  casal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tempo_em_minutos: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pontos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  iniciado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'presenca_real',
  timestamps: false,
});

PresencaReal.belongsTo(Couple, { foreignKey: 'casal_id' });
Couple.hasMany(PresencaReal, { foreignKey: 'casal_id' });

export default PresencaReal;
