import express from 'express';
import { startPresence, getPresenceHistory, deleteHistory } from '../controllers/presenceController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/start', autenticarToken, startPresence);
router.get('/history', autenticarToken, getPresenceHistory);
router.delete('/history/:id', autenticarToken, deleteHistory);

export default router;
