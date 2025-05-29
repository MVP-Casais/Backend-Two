import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'feminino', 'outro'),
    allowNull: false,
    defaultValue: 'outro',
  },
  foto_perfil: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  coupleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'couples', // Agora referencia a tabela couples
      key: 'id'
    }
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

export default User;
