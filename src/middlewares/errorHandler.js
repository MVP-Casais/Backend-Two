export const tratarErro = (err, req, res, next) => {
  console.error('Erro global:', err);

  const statusCode = err.statusCode || 500;
  const mensagem = err.message || 'Erro interno no servidor';

  res.status(statusCode).json({ error: mensagem });
};
