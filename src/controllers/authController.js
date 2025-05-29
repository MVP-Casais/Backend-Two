import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

// Adicione esta definição para aceitar múltiplos client IDs
const googleClientIds = (process.env.GOOGLE_CLIENT_IDS || process.env.GOOGLE_CLIENT_ID || "")
  .split(",")
  .map(id => id.trim())
  .filter(id => id.endsWith('.apps.googleusercontent.com')); // Garante apenas client IDs válidos

const googleClient = new OAuth2Client();

const gerarToken = (userId) => {
  // Gera um JWT válido para o backend
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    let { nome, username, email, senha, genero } = req.body;

    if (!nome || !username || !email || !senha || !genero) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }

    // Corrige o valor do gênero para minúsculo, conforme o ENUM do banco
    if (genero) {
      genero = genero.toLowerCase();
      // Opcional: valida se está no ENUM
      const generosValidos = ['masculino', 'feminino', 'outro'];
      if (!generosValidos.includes(genero)) {
        return res.status(400).json({ error: 'Gênero inválido.' });
      }
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);
    const newUser = await User.create({ nome, username, email, senha: hash, genero });

    const token = gerarToken(newUser.id);
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Erro no register:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = gerarToken(user.id);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      console.error('Token do Google não enviado. Body recebido:', req.body);
      return res.status(400).json({ error: 'Token do Google não enviado.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientIds,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Token do Google inválido.' });
    }

    // Procura usuário pelo e-mail
    let user = await User.findOne({ where: { email: payload.email } });

    if (!user) {
      user = await User.create({
        nome: payload.name || payload.email.split('@')[0],
        username: payload.email.split('@')[0],
        email: payload.email,
        senha: '', 
        genero: 'outro',
        foto_perfil: payload.picture,
      });
    }

    const token = gerarToken(user.id);

    // Retorne os dados essenciais do usuário junto com o token
    res.status(200).json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        username: user.username,
        email: user.email,
        genero: user.genero,
        foto_perfil: user.foto_perfil,
        criado_em: user.criado_em,
      }
    });
  } catch (error) {
    console.error('Erro no login com Google:', error);
    res.status(500).json({ error: 'Erro ao fazer login com Google.' });
  }
};
