import Ranking from "../models/ranking.js";
import { Op } from "sequelize";
import Couple from "../models/couple.js";

export const getRanking = async (req, res) => {
  try {
    const ranking = await Ranking.findAll({
      order: [["pontos", "DESC"]],
      limit: 10, 
    });

    res.json(ranking);
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
