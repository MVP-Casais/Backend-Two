import express from 'express';
import { registerUsage, getDailyUsage, getMostUsedDay } from '../controllers/appUsageController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', autenticarToken, registerUsage);
router.get('/daily', autenticarToken, getDailyUsage);
router.get('/most-used', autenticarToken, getMostUsedDay);

export default router;
