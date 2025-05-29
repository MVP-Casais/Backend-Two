import cors from 'cors';

export const aplicarCors = cors({
  origin: '*', // ou especifique seu domínio
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
