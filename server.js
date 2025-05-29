import dotenv from 'dotenv';
import sequelize from './src/config/db.js';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Banco conectado com sucesso');
    return sequelize.sync(); 
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🔥 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar no banco de dados:', err);
  });
