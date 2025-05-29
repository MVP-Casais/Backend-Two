import User from '../models/user.js';
import Couple from '../models/couple.js';
import Ranking from '../models/ranking.js';
import { Op } from 'sequelize';

// Armazene códigos temporários em memória (para produção, use Redis ou banc
const codeMap = new Map();

// POST /api/connection/request
export const sendConnectionRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username do parceiro é obrigatório.' });
    }

    const partner = await User.findOne({ where: { username } });
    if (!partner) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Procura casal existente (mesmo desconectado)
    let couple = await Couple.findOne({
      where: {
        [Op.or]: [
          { user1Id: userId, user2Id: partner.id },
          { user1Id: partner.id, user2Id: userId }
        ]
      }
    });

    // Se já existe, retorna os dados do parceiro e o id do casal
    if (couple) {
      // Garante que está no ranking
      await ensureCoupleInRanking(couple.id);
      return res.status(200).json({
        name: partner.nome,
        username: partner.username,
        avatarUrl: partner.foto_perfil,
        coupleId: couple.id
      });
    }

    // Cria o casal se não existir
    couple = await Couple.create({
      user1Id: userId,
      user2Id: partner.id
    });

    // Adiciona automaticamente ao ranking
    await ensureCoupleInRanking(couple.id);

    res.status(201).json({
      name: partner.nome,
      username: partner.username,
      avatarUrl: partner.foto_perfil,
      coupleId: couple.id
    });
  } catch (error) {
    console.error('Erro ao conectar parceiro:', error);
    res.status(500).json({ error: 'Erro ao conectar parceiro.' });
  }
};

export const acceptConnection = (req, res) => {
  res.json({ message: 'Conexão aceita (mock)' });
};

export const disconnectPartner = async (req, res) => {
  try {
    const userId = req.userId;

    // Busca todos os casais onde o usuário é user1 ou user2
    const couples = await Couple.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });

    if (!couples || couples.length === 0) {
      return res.status(404).json({ error: 'Nenhuma conexão encontrada para desconectar.' });
    }

    // Em vez de apagar, apenas não faz nada (mantém o registro)
    // Se quiser marcar como "desconectado", adicione um campo "ativo" no modelo e marque como false aqui

    res.json({ message: 'Conexão "desfeita" (registro mantido para reconexão futura).' });
  } catch (error) {
    console.error('Erro ao desconectar parceiro:', error);
    res.status(500).json({ error: 'Erro ao desconectar parceiro.' });
  }
};

export const getConnectionStatus = (req, res) => {
  res.json({ status: 'sem conexão (mock)' });
};

export const togglePlannerShare = (req, res) => {
  res.json({ message: 'Compartilhamento do planner alterado (mock)' });
};

// Pesquisa usernames parecidos para sugestão de conexão
export const searchUsernames = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.length < 2) {
      return res.json([]);
    }
    // Busca usernames que contenham o termo (case-insensitive)
    const users = await User.findAll({
      where: {
        username: {
          [Op.iLike]: `%${username}%`
        }
      },
      attributes: ['username'],
      limit: 10
    });
    res.json(users.map(u => u.username));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usernames' });
  }
};

// Gera um código de 4 dígitos único e associa ao usuário
export const generateConnectionCode = async (req, res) => {
  try {
    const userId = req.userId;
    // Garante que o usuário não está conectado a ninguém
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    if (user.coupleId) return res.status(400).json({ error: 'Você já está conectado a um parceiro.' });

    // Gera código único
    let code;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
    } while (codeMap.has(code));
    codeMap.set(code, userId);

    // Código expira em 10 minutos
    setTimeout(() => codeMap.delete(code), 10 * 60 * 1000);

    res.json({ code });
  } catch (error) {
    console.error('Erro ao gerar código:', error);
    res.status(500).json({ error: 'Erro ao gerar código.' });
  }
};

// Conecta dois usuários usando o código de 4 dígitos
export const connectWithCode = async (req, res) => {
  try {
    const userId = req.userId;
    const { code } = req.body;
    if (!code || typeof code !== 'string' || code.length !== 4) {
      return res.status(400).json({ error: 'Código inválido.' });
    }

    const partnerId = codeMap.get(code);
    if (!partnerId) {
      return res.status(404).json({ error: 'Código não encontrado ou expirado.' });
    }
    if (partnerId === userId) {
      return res.status(400).json({ error: 'Você não pode conectar consigo mesmo.' });
    }

    const user = await User.findByPk(userId);
    const partner = await User.findByPk(partnerId);
    if (!user || !partner) return res.status(404).json({ error: 'Usuário não encontrado.' });
    if (user.coupleId || partner.coupleId) {
      return res.status(400).json({ error: 'Um dos usuários já está conectado.' });
    }

    // Verifica se já existe um casal entre esses dois usuários (em qualquer ordem)
    const existingCouple = await Couple.findOne({
      where: {
        [Op.or]: [
          { user1Id: userId, user2Id: partnerId },
          { user1Id: partnerId, user2Id: userId }
        ]
      }
    });
    if (existingCouple) {
      // Garante que está no ranking
      await ensureCoupleInRanking(existingCouple.id);
      return res.status(409).json({ error: 'Já existe uma conexão entre esses usuários.' });
    }

    // Cria o casal
    const couple = await Couple.create({
      user1Id: partnerId,
      user2Id: userId,
    });

    // Adiciona automaticamente ao ranking
    await ensureCoupleInRanking(couple.id);

    user.coupleId = couple.id;
    partner.coupleId = couple.id;
    await user.save();
    await partner.save();

    codeMap.delete(code);

    res.json({ message: 'Conexão realizada com sucesso.' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Já existe uma conexão entre esses usuários.' });
    }
    console.error('Erro ao conectar com código:', error);
    res.status(500).json({ error: 'Erro ao conectar com código.' });
  }
};

// Endpoint para retornar dados do casal conectado e do parceiro
export const getConnectedCouple = async (req, res) => {
  try {
    const userId = req.userId;

    // Busca o casal onde o usuário está como usuario1_id ou usuario2_id
    const couple = await Couple.findOne({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });

    if (!couple) {
      return res.status(404).json({ error: 'Usuário não está conectado a nenhum casal.' });
    }

    // Descobre o parceiro (quem não é o userId)
    let partnerId = null;
    if (couple.user1Id === userId) {
      partnerId = couple.user2Id;
    } else if (couple.user2Id === userId) {
      partnerId = couple.user1Id;
    }

    let partner = null;
    if (partnerId) {
      partner = await User.findByPk(partnerId, {
        attributes: ['id', 'nome', 'username', 'foto_perfil', 'email', 'genero']
      });
    }

    res.json({
      coupleId: couple.id,
      compartilhar_planner: couple.compartilhar_planner,
      partner: partner ? {
        id: partner.id,
        name: partner.nome,
        username: partner.username,
        avatarUrl: partner.foto_perfil,
        email: partner.email,
        genero: partner.genero
      } : null
    });
  } catch (error) {
    console.error('Erro ao buscar casal conectado:', error);
    res.status(500).json({ error: 'Erro ao buscar casal conectado.' });
  }
};

// Endpoint de teste: conecta dois usuários diretamente pelo username do parceiro (sem código)
export const connectWithUsername = async (req, res) => {
  try {
    const userId = req.userId;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username do parceiro é obrigatório.' });
    }

    const partner = await User.findOne({ where: { username } });
    if (!partner) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    if (partner.id === userId) {
      return res.status(400).json({ error: 'Você não pode conectar consigo mesmo.' });
    }

    // Verifica se ambos não estão conectados
    const user = await User.findByPk(userId);
    if (user.coupleId || partner.coupleId) {
      return res.status(400).json({ error: 'Um dos usuários já está conectado.' });
    }

    // Cria o casal usando os campos corretos do banco
    const couple = await Couple.create({
      user1Id: userId,
      user2Id: partner.id,
    });

    // Atualiza os usuários
    user.coupleId = couple.id;
    partner.coupleId = couple.id;
    await user.save();
    await partner.save();

    res.json({
      message: 'Conexão realizada com sucesso.',
      coupleId: couple.id,
      partner: {
        id: partner.id,
        name: partner.nome,
        username: partner.username,
        avatarUrl: partner.foto_perfil,
        email: partner.email,
        genero: partner.genero,
      }
    });
  } catch (error) {
    console.error('Erro ao conectar com username:', error);
    res.status(500).json({ error: 'Erro ao conectar com username.' });
  }
};

// Garante que o casal está no ranking
async function ensureCoupleInRanking(coupleId) {
  const semanaAno = getCurrentWeekYear();
  const exists = await Ranking.findOne({ where: { coupleId, semanaAno } });
  if (!exists) {
    await Ranking.create({
      coupleId,
      pontos: 0,
      semanaAno,
      criadoEm: new Date(),
    });
  }
}

// Retorna string no formato "YYYY-WW" para semana do ano
function getCurrentWeekYear() {
  const now = new Date();
  const year = now.getFullYear();
  // Calcula a semana do ano (ISO)
  const firstJan = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - firstJan) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}
