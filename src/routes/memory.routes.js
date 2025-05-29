import express from 'express';
import { autenticarToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';
import { createMemory, getMemories, editMemory, deleteMemory } from '../controllers/memoryController.js';

const router = express.Router();

router.get('/', autenticarToken, getMemories);
router.post('/', autenticarToken, upload.single('image'), createMemory);
router.put('/:id', autenticarToken, editMemory);
router.delete('/:id', autenticarToken, deleteMemory);

export default router;