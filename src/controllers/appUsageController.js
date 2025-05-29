import AppUsage from '../models/AppUsage.js';
import { Op } from 'sequelize';

export const registerUsage = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().slice(0, 10);

    let usage = await AppUsage.findOne({ where: { userId, date: today } });
    if (usage) {
      usage.count += 1;
      await usage.save();
    } else {
      usage = await AppUsage.create({ userId, date: today, count: 1 });
    }
    res.json({ message: 'Uso registrado', usage });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar uso.' });
  }
};

export const getDailyUsage = async (req, res) => {
  try {
    const userId = req.userId;
    const usage = await AppUsage.findAll({
      where: { userId },
      order: [['date', 'ASC']]
    });
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar uso diário.' });
  }
};

export const getMostUsedDay = async (req, res) => {
  try {
    const userId = req.userId;
    const usage = await AppUsage.findAll({
      where: { userId },
      order: [['count', 'DESC']],
      limit: 1
    });
    if (usage.length === 0) {
      return res.json({ message: 'Nenhum uso registrado.' });
    }
    res.json({ mostUsedDay: usage[0].date, count: usage[0].count });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dia mais usado.' });
  }
};
