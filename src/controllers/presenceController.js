import PresencaReal from '../models/presenceHistory.js';

// Salvar sessão de presença real
export const startPresence = async (req, res) => {
  try {
    const { casal_id, tempo_em_minutos, pontos } = req.body;
    if (!casal_id || !tempo_em_minutos || pontos === undefined) {
      return res.status(400).json({ error: 'casal_id, tempo_em_minutos e pontos são obrigatórios.' });
    }
    const presenca = await PresencaReal.create({
      casal_id,
      tempo_em_minutos,
      pontos,
      // iniciado_em: novo registro já pega o NOW por padrão
    });
    res.status(201).json(presenca);
  } catch (error) {
    console.error('Erro ao iniciar presença:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Buscar histórico de presença real
export const getPresenceHistory = async (req, res) => {
  try {
    const { casal_id } = req.query;
    if (!casal_id) {
      return res.status(400).json({ error: 'casal_id é obrigatório.' });
    }
    const historico = await PresencaReal.findAll({
      where: { casal_id },
      order: [['iniciado_em', 'DESC']],
    });
    res.json(historico);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PresencaReal.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Histórico não encontrado' });
    res.json({ message: 'Histórico deletado' });
  } catch (error) {
    console.error('Erro ao deletar histórico:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};
