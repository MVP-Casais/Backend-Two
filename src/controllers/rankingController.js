import Ranking from "../models/ranking.js";
import { Op } from "sequelize";
import Couple from "../models/couple.js";
import User from "../models/user.js";

// Retorna o ranking com dados do casal e dos usuários
export const getRanking = async (req, res) => {
  try {
    const ranking = await Ranking.findAll({
      order: [["pontos", "DESC"]],
      limit: 10,
      include: [
        {
          model: Couple,
          attributes: ['id', 'user1Id', 'user2Id'],
          include: [
            {
              model: User,
              as: 'user1',
              attributes: ['id', 'nome', 'username', 'foto_perfil']
            },
            {
              model: User,
              as: 'user2',
              attributes: ['id', 'nome', 'username', 'foto_perfil']
            }
          ]
        }
      ]
    });

    // Formata para frontend: cada item tem pontos, couple e os dois usuários
    res.json(ranking.map(r => ({
      id: r.id,
      pontos: r.pontos,
      coupleId: r.coupleId,
      semanaAno: r.semanaAno,
      criadoEm: r.criadoEm,
      couple: r.Couple ? {
        id: r.Couple.id,
        user1: r.Couple.user1,
        user2: r.Couple.user2
      } : null
    })));
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};

export const resetarRanking = async (req, res) => {
  try {
    await Ranking.update({ pontos: 0 }, { where: {} });
    res.json({ message: "Ranking resetado" });
  } catch (error) {
    console.error("Erro ao resetar ranking:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
};

// Novo endpoint para listar todos os casais cadastrados
export const getCasais = async (req, res) => {
  try {
    const casais = await Couple.findAll();
    res.json(casais);
  } catch (error) {
    console.error("Erro ao buscar casais:", error);
    res.status(500).json({ error: "Erro ao buscar casais" });
  }
};
