import db from '../models/index.js'; // ajuste para seu import de models
import Atividade from '../models/activity.js';
import UserActivityStatus from '../models/UserActivityStatus.js';
import { Op } from 'sequelize';

// 1. Buscar todas as atividades
export const getAllActivities = async (req, res) => {
  try {
    const activities = await Atividade.findAll();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar atividades' });
  }
};

// Salvar atividade (criar ou atualizar)
export const saveActivity = async (req, res) => {
  try {
    const userId = req.userId;
    const { tipo, conteudo } = req.body;

    if (!tipo || !conteudo) {
      return res.status(400).json({ error: 'Tipo e conteudo são obrigatórios.' });
    }

    // Verifica se já existe atividade salva igual para o usuário
    let atividade = await db.atividades_salvas.findOne({
      where: {
        usuario_id: userId,
        tipo,
        'conteudo->>id': conteudo.id // busca pelo id dentro do jsonb
      }
    });

    if (atividade) {
      // Se já existe, só marca como não concluído (salvo)
      await atividade.update({ concluido: false });
      return res.json({ message: 'Atividade já salva, status atualizado.' });
    }

    // Cria nova atividade salva
    await db.atividades_salvas.create({
      usuario_id: userId,
      tipo,
      conteudo,
      concluido: false
    });

    res.status(201).json({ message: 'Atividade salva com sucesso.' });
  } catch (error) {
    console.error('Erro ao salvar atividade:', error);
    res.status(500).json({ error: 'Erro ao salvar atividade.' });
  }
};

// 3. Marcar como feita
export const markAsDone = async (req, res) => {
  try {
    const userId = req.userId;
    const { tipo, conteudo } = req.body;

    if (!tipo || !conteudo) {
      return res.status(400).json({ error: 'Tipo e conteudo são obrigatórios.' });
    }

    let atividade = await db.atividades_salvas.findOne({
      where: {
        usuario_id: userId,
        tipo,
        'conteudo->>id': conteudo.id
      }
    });

    if (!atividade) {
      // Se não existe, cria já como concluída
      await db.atividades_salvas.create({
        usuario_id: userId,
        tipo,
        conteudo,
        concluido: true
      });
      return res.status(201).json({ message: 'Atividade criada e marcada como concluída.' });
    }

    await atividade.update({ concluido: true });
    res.json({ message: 'Atividade marcada como concluída.' });
  } catch (error) {
    console.error('Erro ao marcar atividade como concluída:', error);
    res.status(500).json({ error: 'Erro ao marcar atividade como concluída.' });
  }
};

// 4. Buscar atividades salvas
export const getSavedActivities = async (req, res) => {
  try {
    const userId = req.userId;
    const { tipo } = req.query;

    const where = { usuario_id: userId };
    if (tipo) where.tipo = tipo;

    const atividades = await db.atividades_salvas.findAll({
      where,
      order: [['salvo_em', 'DESC']]
    });

    res.json(atividades.map(a => ({
      ...a.conteudo,
      isSalva: true,
      isFeita: a.concluido
    })));
  } catch (error) {
    console.error('Erro ao buscar atividades salvas:', error);
    res.status(500).json({ error: 'Erro ao buscar atividades salvas.' });
  }
};
