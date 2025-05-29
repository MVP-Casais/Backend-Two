import  User  from '../models/user.js';
import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinary.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'nome', 'username', 'email', 'genero', 'foto_perfil']
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Retorne os dados essenciais do usuário
    res.json({
      id: user.id,
      nome: user.nome,
      username: user.username,
      email: user.email,
      genero: user.genero,
      foto_perfil: user.foto_perfil,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { nome, username, genero } = req.body;
    let foto_perfil_url = null;

    // Se veio arquivo, faz upload para o Cloudinary
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'profiles', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      foto_perfil_url = uploadResult.secure_url;
    }

    // Atualiza usuário no banco
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    user.nome = nome ?? user.nome;
    user.username = username ?? user.username;
    user.genero = genero ?? user.genero;
    if (foto_perfil_url) user.foto_perfil = foto_perfil_url;

    await user.save();

    res.json({
      nome: user.nome,
      username: user.username,
      genero: user.genero,
      foto_perfil: user.foto_perfil,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;
    const { fotoPerfil } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    user.fotoPerfil = fotoPerfil;
    await user.save();

    res.json({ message: 'Foto de perfil atualizada', user });
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const isMatch = await bcrypt.compare(currentPassword, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 8 caracteres.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.senha = hashedPassword;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'A senha é obrigatória para excluir a conta.' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const isMatch = await bcrypt.compare(password, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    await user.destroy();
    res.json({ message: 'Conta excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
};
