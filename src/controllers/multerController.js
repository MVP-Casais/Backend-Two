import cloudinary from '../config/cloudinary.js'; 

// Função para upload de imagem e salvar no banco
async function uploadImage(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    // Upload para o Cloudinary usando uma Promise
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

    const result = await uploadToCloudinary();

    // Salvar no banco (exemplo usando Sequelize)
    // Supondo que você tenha um model Imagem com campos: url, title, userId, etc.
    // Ajuste conforme seu model real!
    // const Imagem = require('../models/imagem');
    // const imagemSalva = await Imagem.create({
    //   url: result.secure_url,
    //   title: req.body.title,
    //   userId: req.userId // se usar autenticação
    // });

    // Se não quiser salvar em tabela separada, pode retornar só a URL:
    res.status(201).json({
      message: 'Upload e salvamento ok!',
      url: result.secure_url,
      public_id: result.public_id,
      // imagem: imagemSalva // descomente se salvar no banco
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default uploadImage;
