import express from 'express';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import coupleRoutes from './routes/couple.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import memoryRoutes from './routes/memory.routes.js';
import plannerRoutes from './routes/planner.routes.js';
import activityRoutes from './routes/activity.routes.js';
import appUsageRoutes from './routes/appUsage.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/couples', coupleRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/app-usage', appUsageRoutes);

export default app;