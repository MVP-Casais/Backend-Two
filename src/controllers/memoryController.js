import Memory from '../models/memory.js';
import Couple from '../models/couple.js';
import cloudinary from '../config/cloudinary.js';
import { Op } from 'sequelize';

// Cria uma nova memória: salva imagem no Cloudinary e URL no banco
export const createMemory = async (req, res) => {
  try {
    const userId = req.userId;
    const { titulo, descricao, coupleId } = req.body; // Corrija para coupleId

    // Debug: log do body e file
    console.log('POST /api/memories', { userId, titulo, descricao, coupleId, file: req.file });

    if (!titulo || !descricao || !coupleId) {
      console.log('Faltando campos obrigatórios');
      return res.status(400).json({ error: 'Título, descrição e coupleId são obrigatórios.' });
    }
    if (!req.file) {
      console.log('Imagem não enviada');
      return res.status(400).json({ error: 'Imagem é obrigatória.' });
    }

    // Confirma se o casal existe e o usuário faz parte dele
    const couple = await Couple.findOne({
      where: {
        id: Number(coupleId),
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });

    if (!couple) {
      return res.status(400).json({ error: 'Couple não encontrado ou usuário não pertence ao casal.' });
    }

    // Upload da imagem para o Cloudinary
    let uploadResult;
    try {
      uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'memories', resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer);
      });
    } catch (err) {
      console.error('Erro no upload do Cloudinary:', err);
      return res.status(500).json({ error: 'Erro ao enviar imagem para o Cloudinary.' });
    }

    // Salva no banco
    let memory;
    try {
      // Debug: log dos dados antes de salvar
      console.log('Tentando salvar no banco:', {
        casal_id: Number(coupleId),
        titulo,
        descricao,
        image_url: uploadResult.secure_url,
        criado_por: userId,
      });

      memory = await Memory.create({
        casal_id: Number(coupleId),
        titulo,
        descricao,
        image_url: uploadResult.secure_url,
        criado_por: userId,
      });
    } catch (err) {
      console.error('Erro ao salvar memória no banco:', err);
      // Log detalhado do erro do Sequelize
      if (err.errors) {
        err.errors.forEach(e => console.error(e.message, e.path));
      }
      return res.status(500).json({ error: 'Erro ao salvar memória no banco.', details: err.message });
    }

    console.log('Memória criada com sucesso:', memory.id);

    res.status(201).json({
      id: memory.id,
      title: memory.titulo,
      description: memory.descricao,
      imageUrl: memory.image_url,
      date: memory.criado_em,
    });
  } catch (error) {
    console.error('Erro inesperado ao criar memória:', error);
    res.status(500).json({ error: 'Erro inesperado ao criar memória.' });
  }
};

// Lista memórias do casal do usuário logado
export const getMemories = async (req, res) => {
  try {
    const userId = req.userId;
    // Busca o casal do usuário na tabela couples (campos user1Id/user2Id)
    const couple = await Couple.findOne({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    });
    if (!couple) {
      return res.status(404).json({ error: 'Usuário não está em um casal.' });
    }

    // Busca as memórias usando o campo casal_id que referencia couples.id
    const memories = await Memory.findAll({
      where: { casal_id: couple.id },
      order: [['criado_em', 'DESC']]
    });

    res.json(memories.map(m => ({
      id: m.id,
      title: m.titulo,
      description: m.descricao,
      imageUrl: m.image_url,
      date: m.criado_em,
    })));
  } catch (error) {
    console.error('Erro ao buscar memórias:', error);
    res.status(500).json({ error: 'Erro ao buscar memórias.' });
  }
};

// Editar memória
export const editMemory = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { titulo, descricao } = req.body;

    const memory = await Memory.findOne({
      where: {
        id,
        criado_por: userId,
      }
    });

    if (!memory) {
      return res.status(404).json({ error: 'Memória não encontrada.' });
    }

    memory.titulo = titulo ?? memory.titulo;
    memory.descricao = descricao ?? memory.descricao;
    await memory.save();

    res.json({
      id: memory.id,
      title: memory.titulo,
      description: memory.descricao,
      imageUrl: memory.image_url,
      date: memory.criado_em,
    });
  } catch (error) {
    console.error('Erro ao editar memória:', error);
    res.status(500).json({ error: 'Erro ao editar memória.' });
  }
};

// Excluir memória
export const deleteMemory = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const memory = await Memory.findOne({
      where: {
        id,
        criado_por: userId,
      }
    });

    if (!memory) {
      return res.status(404).json({ error: 'Memória não encontrada.' });
    }

    await memory.destroy();
    res.json({ message: 'Memória excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir memória:', error);
    res.status(500).json({ error: 'Erro ao excluir memória.' });
  }
};
