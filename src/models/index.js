import sequelize from '../config/db.js';
import { Op } from 'sequelize';

// Importando os models
import User from './user.js';
import Couple from './couple.js';
import Ranking from './ranking.js';
import Memoria from './memory.js';
import PlannerEvent from './planner.js';
import Atividade from './activity.js';
import UserActivityStatus from './UserActivityStatus.js';
import PresencaReal from './presenceHistory.js';
import Categoria from './categoria.js';
import AppUsage from './AppUsage.js';

// Remova qualquer linha duplicada de associação com o mesmo alias!
// Cada alias deve ser usado apenas uma vez por modelo.

// Associações corretas e únicas:
User.hasMany(Couple, { foreignKey: 'usuario1_id', as: 'casaisComoUser1' });
User.hasMany(Couple, { foreignKey: 'usuario2_id', as: 'casaisComoUser2' });
Couple.belongsTo(User, { foreignKey: 'usuario1_id', as: 'user1' });
Couple.belongsTo(User, { foreignKey: 'usuario2_id', as: 'user2' });

Couple.hasMany(Ranking, { foreignKey: 'coupleId' });
Ranking.belongsTo(Couple, { foreignKey: 'coupleId' });
Couple.hasMany(Ranking, { foreignKey: 'coupleId' });

Couple.hasMany(Memoria, { foreignKey: 'casal_id' });
Memoria.belongsTo(Couple, { foreignKey: 'casal_id' });

Couple.hasMany(PlannerEvent, { foreignKey: 'coupleId' });
PlannerEvent.belongsTo(Couple, { foreignKey: 'coupleId' });

Couple.hasMany(PresencaReal, { foreignKey: 'coupleId' });
PresencaReal.belongsTo(Couple, { foreignKey: 'coupleId' });

User.hasMany(UserActivityStatus, { foreignKey: 'userId' });
Atividade.hasMany(UserActivityStatus, { foreignKey: 'atividadeId' });
UserActivityStatus.belongsTo(User, { foreignKey: 'userId' });
UserActivityStatus.belongsTo(Atividade, { foreignKey: 'atividadeId' });

User.hasMany(Categoria, { foreignKey: 'usuario_id' });
Categoria.belongsTo(User, { foreignKey: 'usuario_id' });

// Exportando tudo junto
const db = {
  sequelize,
  User,
  Couple,
  Ranking,
  Memoria,
  PlannerEvent,
  Atividade,
  UserActivityStatus,
  PresencaReal,
  Categoria,
  AppUsage, // adicione aqui
};

// (Opcional) Sincroniza o banco de dados ao iniciar — cuidado em produção
// await sequelize.sync({ alter: true }); // ou force: true pra recriar tudo

export default db;
