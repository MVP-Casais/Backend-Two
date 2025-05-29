import express from 'express';
import { getRanking } from '../controllers/rankingController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', autenticarToken, getRanking);

export default router;
