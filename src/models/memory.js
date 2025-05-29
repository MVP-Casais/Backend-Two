import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Memory extends Model {}

Memory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  casal_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  criado_por: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Memoria',
  tableName: 'memorias',
  timestamps: false,
  // Não use nada relacionado a "coupleId" aqui!
});

export default Memory;
