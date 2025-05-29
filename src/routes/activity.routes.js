import express from 'express';
import { getAllActivities, saveActivity, markAsDone, getSavedActivities } from '../controllers/activityController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllActivities);
router.post('/save', autenticarToken, saveActivity);
router.post('/done', autenticarToken, markAsDone);
router.get('/saved', autenticarToken, getSavedActivities);

export default router;
