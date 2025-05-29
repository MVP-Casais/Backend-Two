import express from 'express';
import { register, login, loginWithGoogle } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/login-google', loginWithGoogle);

export default router;
