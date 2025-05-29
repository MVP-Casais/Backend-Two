import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const Atividade = sequelize.define('Atividade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.ENUM('atividade_em_casa', 'atividade_fora_casa', 'desafio_em_casa', 'desafio_fora_casa', 'perguntas_conexao'),
    allowNull: false,
  },
  conteudo: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  criadoEm: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'atividades',
  timestamps: false,
});

export default Atividade;
