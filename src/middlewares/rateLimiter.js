import rateLimit from 'express-rate-limit';

export const limitarRequisicoes = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Muitas requisições feitas. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
