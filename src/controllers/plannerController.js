import PlannerEvent from "../models/planner.js";
import Couple from "../models/couple.js"; // Este model já está correto, pois usa tableName: 'casais'
import Categoria from "../models/categoria.js";
import { Op } from "sequelize";

// Criação de evento
export const createEvento = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      nomeEvento,
      descricao,
      dataEvento,
      horaInicio,
      horaTermino,
      categoria,
      coupleId,
    } = req.body;

    if (!coupleId || isNaN(Number(coupleId))) {
      return res.status(400).json({
        error: "coupleId inteiro é obrigatório para criar um evento.",
      });
    }

    // Busca na tabela correta: casais (model Couple já usa tableName: 'casais')
    const couple = await Couple.findOne({ where: { id: Number(coupleId) } });
    if (!couple) {
      return res.status(400).json({
        error: `O casal informado não existe. coupleId enviado: ${coupleId}`,
      });
    }

    // Atenção: use camelCase no código, Sequelize faz o mapeamento para snake_case
    const evento = await PlannerEvent.create({
      coupleId: Number(coupleId),
      nomeEvento,
      descricao,
      dataEvento,
      horaInicio,
      horaTermino,
      categoria,
    });

    res.status(201).json(evento);
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ error: "Erro no servidor", details: error.message });
  }
};

// Listagem de eventos
export const getEventos = async (req, res) => {
  try {
    const { coupleId } = req.query;
    let eventos;

    // Sempre busque pelo coupleId do usuário logado se não vier na query
    let coupleIdToUse = coupleId;
    if (!coupleIdToUse) {
      // Busca o casal do usuário logado
      const userId = req.userId;
      const couple = await Couple.findOne({
        where: {
          [Op.or]: [{ usuario1_id: userId }, { usuario2_id: userId }],
        },
      });
      if (couple) coupleIdToUse = couple.id;
    }

    if (coupleIdToUse && !isNaN(Number(coupleIdToUse))) {
      eventos = await PlannerEvent.findAll({
        where: { coupleId: Number(coupleIdToUse) },
        order: [['dataEvento', 'ASC']],
      });
    } else {
      eventos = [];
    }

    res.json(eventos);
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    res.status(500).json({ error: "Erro no servidor", details: error.message });
  }
};

// Atualização de evento
export const updateEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nomeEvento,
      descricao,
      dataEvento,
      horaInicio,
      horaTermino,
      categoria,
    } = req.body;

    const evento = await PlannerEvent.findOne({ where: { id } });
    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    evento.nomeEvento = nomeEvento || evento.nomeEvento;
    evento.descricao = descricao || evento.descricao;
    evento.dataEvento = dataEvento || evento.dataEvento;
    evento.horaInicio = horaInicio || evento.horaInicio;
    evento.horaTermino = horaTermino || evento.horaTermino;
    evento.categoria = categoria || evento.categoria;

    await evento.save();

    res.json({ message: "Evento atualizado", evento });
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    res.status(500).json({ error: "Erro no servidor", details: error.message });
  }
};

// Exclusão de evento
export const deleteEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await PlannerEvent.findOne({ where: { id } });
    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    await evento.destroy();

    res.json({ message: "Evento deletado" });
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    res.status(500).json({ error: "Erro no servidor", details: error.message });
  }
};

// Buscar id do casal conectado
export const getConnectedCoupleId = async (req, res) => {
  try {
    const userId = req.userId;

    const couple = await Couple.findOne({
      where: {
        [Op.or]: [{ usuario1_id: userId }, { usuario2_id: userId }],
      },
    });

    if (!couple) {
      // Log detalhado para debug
      console.log(`Usuário ${userId} não está conectado a nenhum casal.`);
      return res
        .status(404)
        .json({ error: "Usuário não está conectado a nenhum casal." });
    }

    res.json({ coupleId: couple.id });
  } catch (error) {
    console.error("Erro ao buscar id do casal conectado:", error);
    res.status(500).json({ error: "Erro ao buscar id do casal.", details: error.message });
  }
};

// Criar nova categoria personalizada
export const createCategoria = async (req, res) => {
  try {
    const userId = req.userId;
    const { nome, cor } = req.body;
    if (!nome || !cor) {
      return res.status(400).json({ error: "Nome e cor são obrigatórios." });
    }
    // Garante unicidade por usuário
    const exists = await Categoria.findOne({ where: { usuario_id: userId, nome } });
    if (exists) {
      return res.status(409).json({ error: "Categoria já existe para este usuário." });
    }
    const categoria = await Categoria.create({
      usuario_id: userId,
      nome,
      cor, // cor em formato "#RRGGBB"
    });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar categoria.", details: error.message });
  }
};

// Listar categorias do usuário (padrão + personalizadas)
export const getCategorias = async (req, res) => {
  try {
    const userId = req.userId;
    // Categorias padrão do sistema
    const categoriasPadrao = [
      { nome: "Série/Filme", cor: "#FF0505" },
      { nome: "Jantar", cor: "#FFA726" },
      { nome: "Atividade Física", cor: "#F06292" },
      { nome: "Trabalho", cor: "#00695C" },
      { nome: "Família", cor: "#8BC34A" },
      { nome: "Encontro", cor: "#7E57C2" },
      { nome: "Estudo", cor: "#FFEB3B" },
      { nome: "Lazer", cor: "#9C27B0" },
      { nome: "Outros", cor: "#6ED58D" },
      { nome: "Viagem", cor: "#FF9797" },
    ];
    // Busca personalizadas do usuário
    const custom = await Categoria.findAll({ where: { usuario_id: userId } });
    const customList = custom.map(c => ({
      nome: c.nome,
      cor: c.cor,
      id: c.id,
      personalizada: true,
    }));
    res.json([...categoriasPadrao, ...customList]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categorias.", details: error.message });
  }
};

// Apagar categoria personalizada do usuário
export const deleteCategoria = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const categoria = await Categoria.findOne({ where: { id, usuario_id: userId } });
    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }
    await categoria.destroy();
    res.json({ message: "Categoria removida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover categoria.", details: error.message });
  }
};
