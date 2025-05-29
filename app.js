import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import memoryRoutes from './src/routes/memory.routes.js';
import activityRoutes from './src/routes/activity.routes.js';
import plannerRoutes from './src/routes/planner.routes.js';
import presenceRoutes from './src/routes/presence.routes.js';
import rankingRoutes from './src/routes/ranking.routes.js';
import connectionRoutes from './src/routes/connection.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import emailVerificationRoutes from './src/routes/emailVerification.routes.js';
import passwordResetRoutes from './src/routes/passwordReset.routes.js';
import { aplicarCors } from './src/middlewares/corsMiddleware.js';
import { tratarErro } from './src/middlewares/errorHandler.js';

const app = express();

// Middleware para processar JSON
app.use(express.json());

// Middleware para processar dados de formulários (caso necessário)
app.use(express.urlencoded({ extended: true }));

// Aplicar CORS
app.use(aplicarCors);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/presence', presenceRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/connection', connectionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/email-verification', emailVerificationRoutes);
app.use('/api/password-reset', passwordResetRoutes);

// Middleware de tratamento de erros
app.use(tratarErro);

export default app;
