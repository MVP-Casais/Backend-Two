import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  // Aceita "Bearer <token>" ou apenas "<token>"
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) return res.status(401).json({ error: 'Token mal formatado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token inválido:', err);
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }

    req.userId = decoded.id;
    next();
  });
};
