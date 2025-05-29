import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Categoria = sequelize.define('categorias', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  cor: {
    type: DataTypes.STRING(7),
    allowNull: true,
  },
}, {
  tableName: 'categorias',
  timestamps: false,
});

export default Categoria;
