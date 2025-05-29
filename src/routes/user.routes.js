import express from 'express';
import { changePassword, deleteAccount, getProfile, updateProfile } from '../controllers/userController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.get('/me', autenticarToken, getProfile);
router.put('/me', autenticarToken, upload.single('foto_perfil'), updateProfile);
router.put('/me/change-password', autenticarToken, changePassword);
router.delete('/me/delete-account', autenticarToken, deleteAccount);

export default router;
