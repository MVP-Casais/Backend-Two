import User from '../models/user.js';
import Couple from '../models/couple.js';
import { Op } from 'sequelize';

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
          { usuario1_id: userId, usuario2_id: partner.id },
          { usuario1_id: partner.id, usuario2_id: userId }
        ]
      }
    });

    // Se já existe, retorna os dados do parceiro e o id do casal
    if (couple) {
      return res.status(200).json({
        name: partner.nome,
        username: partner.username,
        avatarUrl: partner.foto_perfil,
        coupleId: couple.id // <-- importante para o planner!
      });
    }

    // Cria o casal se não existir
    couple = await Couple.create({
      usuario1_id: userId,
      usuario2_id: partner.id
    });

    res.status(201).json({
      name: partner.nome,
      username: partner.username,
      avatarUrl: partner.foto_perfil,
      coupleId: couple.id // <-- importante para o planner!
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
          { usuario1_id: userId },
          { usuario2_id: userId }
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
