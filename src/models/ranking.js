import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Couple from './couple.js';

const Ranking = sequelize.define('Ranking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  coupleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pontos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  semanaAno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  criadoEm: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'rankings',
  timestamps: false,
});

Ranking.belongsTo(Couple, { foreignKey: 'coupleId' });
Couple.hasMany(Ranking, { foreignKey: 'coupleId' });

export default Ranking;
